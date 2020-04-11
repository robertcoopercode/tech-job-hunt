import { mutationField, idArg, stringArg, intArg, arg, booleanArg } from '@nexus/schema';
import { catchAsyncErrors } from '../../utils/catchErrors';
import { emptyS3Directory } from '../../utils/emptyS3Directory';
import { fileUpload } from '../../utils/fileUpload';
import analytics from '../../utils/analytics';

export const updateCompanyMutationField = mutationField('updateCompany', {
    type: 'Company',
    args: {
        name: stringArg(),
        website: stringArg({
            required: false,
        }),
        rating: intArg({
            required: false,
        }),
        contacts: arg({
            type: 'CompanyContactCreateWithoutCompanyInput',
            list: true,
        }),
        file: arg({
            type: 'Upload',
            required: false,
        }),
        notes: stringArg(),
        isCompanyImageUpdated: booleanArg({
            required: true,
        }),
        id: idArg({ required: true }),
    },
    resolve: async (_, { id, name, website, rating, notes, file, contacts, isCompanyImageUpdated }, ctx) => {
        return catchAsyncErrors(async () => {
            // Verify user is associated with the company they are trying to update
            const { User: companyUser } = await ctx.prisma.company.findOne({
                where: { id },
                select: { User: true },
            });
            if (companyUser.id !== ctx.user.id) {
                throw Error('Company is not associated with current user');
            }

            // Variable that will hold new cover letter AWS info if there is a new cover letter updated by the user
            let companyImageAwsFileData;

            const { Image: existingCompanyImage, name: existingCompanyName } = await ctx.prisma.company.findOne({
                where: { id },
                select: { Image: true, name: true },
            });

            // If changing the company name, update the `companyName` field on all job applications associated with the company
            if (existingCompanyName !== name) {
                await ctx.prisma.jobApplication.updateMany({
                    where: { Company: { id } },
                    data: { companyName: name },
                });
            }

            // If there is already an existing company image and it has been updated in the front-end,
            // make sure to delete the existing image from S3 before uploading a new one
            if (existingCompanyImage && isCompanyImageUpdated) {
                // Delete all company images from S3, including all resized images, before uploading new image
                const match = existingCompanyImage.s3Url.match(/.*\.amazonaws.com\/(.*\/companies\/[^\/]*)\/.*/);
                if (match) {
                    await emptyS3Directory(match[1]);
                }
            }

            // Upload new cover letter to AWS if the cover letter has been updated by the user
            if (isCompanyImageUpdated) {
                companyImageAwsFileData = await fileUpload({
                    userId: ctx.user.id,
                    filePathPrefix: `companies`,
                    file,
                });
            }

            const currentContacts = await ctx.prisma.companyContact.findMany({
                where: { Company: { id } },
            });
            const contactIdsToDelete = currentContacts.reduce((prev: string[], curr) => {
                if (curr.id && contacts.every((contact) => contact.id !== curr.id)) {
                    prev.push(curr.id);
                }
                return prev;
            }, []);
            const contactsToUpdate = contacts.filter((contact) => currentContacts.some((c) => c.id === contact.id));
            const contactsToCreate = contacts.filter((contact) => currentContacts.every((c) => c.id !== contact.id));

            // Then create the company entry in Prisma, storing the S3 file info
            const updatedCompany = await ctx.prisma.company.update({
                where: {
                    id,
                },
                data: {
                    name,
                    website,
                    rating,
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
                    Image: {
                        ...(companyImageAwsFileData
                            ? {
                                  upsert: {
                                      create: companyImageAwsFileData,
                                      update: companyImageAwsFileData,
                                  },
                              }
                            : {}),
                        delete: isCompanyImageUpdated && file === undefined,
                    },
                },
            });

            analytics.track({
                eventType: 'Company updated',
                userId: ctx.user.id,
                eventProperties: {
                    id: id,
                },
            });

            return updatedCompany;
        });
    },
});
