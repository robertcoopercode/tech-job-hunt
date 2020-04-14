import { mutationField, idArg } from '@nexus/schema';
import { deleteS3Files } from '../../utils/deleteS3File';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const deleteJobApplicationMutationField = mutationField('deleteJobApplication', {
    type: 'JobApplication',
    args: {
        jobId: idArg({ required: true }),
    },
    resolve: async (_, { jobId: id }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        const jobApplication = await ctx.prisma.jobApplication.findOne({
            where: { id: id },
            select: { User: true, CoverLetterFile: true, Company: { select: { id: true } } },
        });
        if (jobApplication === null) {
            throw Error('Job application not found');
        }
        if (jobApplication.User?.id !== ctx.user.id) {
            throw Error('User unauthorized to delete job application');
        }

        const deletedJobApplication = await ctx.prisma.jobApplication.delete({ where: { id: id } });

        // Delete cover letter from S3
        if (jobApplication.CoverLetterFile !== null) {
            await deleteS3Files({
                key: jobApplication.CoverLetterFile.Key,
                versionIds: [jobApplication.CoverLetterFile.VersionId],
            });
        }

        // Set the jobApplicationsCount to the updated value on the company
        if (jobApplication.Company !== null) {
            const companyJobApplications = await ctx.prisma.jobApplication.findMany({
                where: { Company: { id: jobApplication.Company.id } },
            });
            const count = companyJobApplications.length;

            await ctx.prisma.company.update({
                where: { id: jobApplication.Company.id },
                data: { jobApplicationsCount: count },
            });
        }

        analytics.track({
            eventType: 'Job application deleted',
            userId: ctx.user.id,
            eventProperties: {
                id: id,
            },
        });

        return deletedJobApplication;
    },
});
