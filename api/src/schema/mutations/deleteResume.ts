import { mutationField, idArg } from '@nexus/schema';
import { deleteS3Files } from '../../utils/deleteS3File';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const deleteResumeMutationField = mutationField('deleteResume', {
    type: 'Resume',
    args: {
        id: idArg({ required: true }),
    },
    resolve: async (_, { id }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        const resume = await ctx.prisma.resume.findOne({ where: { id }, select: { User: true, Versions: true } });
        if (resume === null) {
            throw Error('Resume not found');
        }
        if (resume.User === null) {
            throw Error('User not found');
        }
        if (resume.User.id !== ctx.user.id) {
            throw Error('User not authorized');
        }
        const deletedResume = await ctx.prisma.resume.delete({ where: { id } });

        // Delete file from S3
        await deleteS3Files({
            key: resume.Versions[0].Key,
            versionIds: resume.Versions.map((resume) => resume.VersionId),
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
