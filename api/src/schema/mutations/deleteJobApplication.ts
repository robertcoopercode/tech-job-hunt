import { mutationField, idArg } from '@nexus/schema';
import { deleteS3Files } from '../../utils/deleteS3File';
import analytics from '../../utils/analytics';

export const deleteJobApplicationMutationField = mutationField('deleteJobApplication', {
    type: 'JobApplication',
    args: {
        jobId: idArg(),
    },
    resolve: async (_, { jobId }, ctx) => {
        if (!ctx.user.id) {
            return;
        }
        const jobApplicationUser = await ctx.prisma.jobApplication.findOne({
            where: { id: jobId },
            select: { User: true },
        });
        if (jobApplicationUser.User.id !== ctx.user.id) {
            return;
        }
        const companyId = await ctx.prisma.jobApplication.findOne({
            where: { id: jobId },
            select: { Company: { select: { id: true } } },
        });
        const { CoverLetterFile } = await ctx.prisma.jobApplication.findOne({
            where: { id: jobId },
            select: { CoverLetterFile: true },
        });
        const deletedJobApplication = await ctx.prisma.jobApplication.delete({ where: { id: jobId } });

        // Delete cover letter from S3
        if (CoverLetterFile) {
            await deleteS3Files({
                key: CoverLetterFile.Key,
                versionIds: [CoverLetterFile.VersionId],
            });
        }

        // Set the jobApplicationsCount to the updated value on the company
        if (deletedJobApplication) {
            const companyJobApplications = await ctx.prisma.jobApplication.findMany({
                where: { Company: { id: companyId.Company.id } },
            });
            const count = companyJobApplications.length;

            await ctx.prisma.company.update({
                where: { id: companyId.Company.id },
                data: { jobApplicationsCount: count },
            });
        }

        analytics.track({
            eventType: 'Job application deleted',
            userId: ctx.user.id,
            eventProperties: {
                id: jobId,
            },
        });

        return deletedJobApplication;
    },
});
