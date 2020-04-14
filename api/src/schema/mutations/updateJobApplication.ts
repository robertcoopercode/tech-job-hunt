import { mutationField, idArg, stringArg, arg, booleanArg, intArg } from '@nexus/schema';
import { freeTierJobLimit } from '../../utils/constants';
import { deleteS3Files } from '../../utils/deleteS3File';
import { fileUpload } from '../../utils/fileUpload';
import analytics from '../../utils/analytics';

export const updateJobApplicationMutationField = mutationField('updateJobApplication', {
    type: 'JobApplication',
    args: {
        id: idArg({ required: true }),
        companyId: idArg(),
        position: stringArg(),
        location: arg({
            type: 'GoogleMapsLocationUpdateInput',
            required: false,
        }),
        isCoverLetterUpdated: booleanArg({
            required: true,
        }),
        rating: intArg(),
        jobListingLink: stringArg(),
        jobListingNotes: stringArg(),
        resumeId: stringArg(),
        resumeVersionId: stringArg(),
        coverLetterFile: arg({
            type: 'Upload',
            required: false,
        }),
        isApplicationActive: booleanArg(),
        contacts: arg({
            type: 'JobApplicationContactCreateWithoutJobApplicationInput',
            list: true,
        }),
        applicationStatus: arg({ type: 'ApplicationStatus', required: false }),
        dateApplied: arg({
            type: 'DateTime',
            required: false,
        }),
        dateDecided: arg({
            type: 'DateTime',
            required: false,
        }),
        dateInterviewing: arg({
            type: 'DateTime',
            required: false,
            list: true,
        }),
        dateOffered: arg({
            type: 'DateTime',
            required: false,
        }),
        isRemote: booleanArg(),
        jobDecision: arg({
            type: 'JobDecision',
            required: false,
        }),
        notes: stringArg(),
    },
    resolve: async (
        _,
        {
            id,
            companyId,
            position,
            location,
            rating,
            jobListingLink,
            jobListingNotes,
            contacts,
            resumeId,
            resumeVersionId,
            coverLetterFile,
            isCoverLetterUpdated,
            isApplicationActive,
            applicationStatus,
            dateApplied,
            dateDecided,
            dateInterviewing,
            dateOffered,
            isRemote,
            jobDecision,
            notes,
        },
        ctx
    ) => {
        const { Billing } = await ctx.prisma.user.findOne({
            where: { id: ctx.user.id },
            select: { Billing: { select: { isPremiumActive: true } } },
        });

        const isPremium = Billing?.isPremiumActive;

        if (!isPremium) {
            const jobApplications = await ctx.prisma.jobApplication.findMany({
                where: { User: { id: ctx.user.id } },
            });
            const jobApplicationsCount = jobApplications.length;
            if (jobApplicationsCount !== undefined && jobApplicationsCount > freeTierJobLimit) {
                throw Error('User cannot update job since free tier limit has been reached.');
            }
        }

        // Verify user is associated with the company they are trying to update
        const { User: jobApplicationUser } = await ctx.prisma.jobApplication.findOne({
            where: { id },
            select: { User: true },
        });
        if (jobApplicationUser.id !== ctx.user.id) {
            throw Error('Job application is not associated with current user');
        }

        // Variable that will hold new cover letter AWS info if there is a new cover letter updated by the user
        let coverLetterAwsFileData;

        const { CoverLetterFile: existingCoverLetter } = await ctx.prisma.jobApplication.findOne({
            where: { id },
            select: { CoverLetterFile: true },
        });

        // If there is already an existing cover letter and it has been updated in the front-end,
        // make sure to delete the existing cover letter from S3 before uploading a new one
        if (existingCoverLetter && isCoverLetterUpdated) {
            await deleteS3Files({
                key: existingCoverLetter.Key,
                versionIds: [existingCoverLetter.VersionId],
            });
        }

        // Upload new cover letter to AWS if the cover letter has been updated by the user
        if (isCoverLetterUpdated) {
            coverLetterAwsFileData = await fileUpload({
                userId: ctx.user.id,
                filePathPrefix: `coverLetters`,
                file: coverLetterFile,
                isImage: false,
            });
        }

        const currentContacts = await ctx.prisma.jobApplicationContact.findMany({
            where: { JobApplication: { id } },
        });
        const contactIdsToDelete = currentContacts.reduce((prev: string[], curr) => {
            if (curr.id && contacts.every((contact) => contact.id !== curr.id)) {
                prev.push(curr.id);
            }
            return prev;
        }, []);
        const contactsToUpdate = contacts.filter((contact) => currentContacts.some((c) => c.id === contact.id));
        const contactsToCreate = contacts.filter((contact) => currentContacts.every((c) => c.id !== contact.id));

        let existingLocation;

        if (location && location.id) {
            existingLocation = await ctx.prisma.googleMapsLocation.findOne({ where: { id: location.id } });
        }

        const { name: companyName } = await ctx.prisma.company.findOne({
            where: { id: companyId },
            select: { name: true },
        });

        const {
            Company: { id: existingCompanyId },
        } = await ctx.prisma.jobApplication.findOne({
            where: { id },
            select: { Company: { select: { id: true } } },
        });

        const updateJobApplication = await ctx.prisma.jobApplication.update({
            where: {
                id,
            },
            data: {
                Company: { connect: { id: companyId } },
                position,
                Location: {
                    create:
                        existingLocation || !location
                            ? undefined
                            : { googlePlacesId: location.googlePlacesId, name: location.name },
                    delete: existingLocation ? location === null : undefined,
                },
                locationName: location && location.name,
                rating,
                jobListingLink,
                jobListingNotes,
                companyName,
                applicationStatus,
                dateApplied,
                dateDecided,
                JobApplication_dateInterviewing: {
                    set: dateInterviewing.filter((date) => date !== ''),
                },
                dateOffered,
                isRemote,
                jobDecision,
                notes,
                Contacts: {
                    ...(contactsToUpdate.length
                        ? {
                              updateMany: contactsToUpdate.map((contact) => {
                                  const { id, ...data } = contact;
                                  return {
                                      where: {
                                          id,
                                      },
                                      data,
                                  };
                              }),
                          }
                        : {}),
                    ...(contactsToCreate.length ? { create: contactsToCreate } : {}),
                    ...(contactIdsToDelete.length
                        ? {
                              deleteMany: {
                                  id: { in: contactIdsToDelete },
                              },
                          }
                        : {}),
                },
                Resume: {
                    ...(resumeId
                        ? {
                              upsert: {
                                  create: {
                                      Resume: {
                                          connect: {
                                              id: resumeId,
                                          },
                                      },
                                      selectedVersionId: resumeVersionId,
                                  },
                                  update: {
                                      Resume: {
                                          connect: {
                                              id: resumeId,
                                          },
                                      },
                                      selectedVersionId: resumeVersionId,
                                  },
                              },
                          }
                        : {}),
                    // disconnect: resumeId === null,
                },
                CoverLetterFile: {
                    ...(coverLetterAwsFileData
                        ? {
                              upsert: {
                                  create: coverLetterAwsFileData,
                                  update: coverLetterAwsFileData,
                              },
                          }
                        : {}),
                    delete: isCoverLetterUpdated && coverLetterFile === undefined,
                },
                isApplicationActive,
            },
        });

        // If the company changed, make sure to update the jobApplicationsCount field on both companies
        if (existingCompanyId !== companyId) {
            const previousCompanyJobs = await ctx.prisma.jobApplication.findMany({
                where: { Company: { id: existingCompanyId } },
            });
            const previousCompanyCount = previousCompanyJobs.length;
            const currentCompanyJobs = await ctx.prisma.jobApplication.findMany({
                where: { Company: { id: companyId } },
            });
            const currentCompanyCount = currentCompanyJobs.length;
            await ctx.prisma.company.update({
                where: { id: companyId },
                data: { jobApplicationsCount: currentCompanyCount },
            });
            await ctx.prisma.company.update({
                where: { id: companyId },
                data: { jobApplicationsCount: previousCompanyCount },
            });
        }

        analytics.track({
            eventType: 'Job application updated',
            userId: ctx.user.id,
            eventProperties: {
                id,
            },
        });

        return updateJobApplication;
    },
});
