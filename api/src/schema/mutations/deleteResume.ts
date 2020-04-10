import { mutationField, idArg } from '@nexus/schema';
import { deleteS3Files } from '../../utils/deleteS3File';
import analytics from '../../utils/analytics';

export const deleteResumeMutationField = mutationField('deleteResume', {
    type: 'Resume',
    args: {
        id: idArg(),
    },
    resolve: async (_, { id }, ctx) => {
        if (!ctx.user.id) {
            return;
        }
        const { User: resumeUser } = await ctx.prisma.resume.findOne({ where: { id }, select: { User: true } });
        if (resumeUser.id !== ctx.user.id) {
            return;
        }
        const { Versions: awsFileVersions } = await ctx.prisma.resume.findOne({
            where: { id },
            select: { Versions: true },
        });
        const deletedResume = await ctx.prisma.resume.delete({ where: { id } });

        // Delete file from S3
        await deleteS3Files({
            key: awsFileVersions[0].Key,
            versionIds: awsFileVersions.map(resume => resume.VersionId),
        });

        analytics.track({
            eventType: 'Resume deleted',
            userId: ctx.user.id,
            eventProperties: {
                id,
            },
        });

        return deletedResume;
    },
});
