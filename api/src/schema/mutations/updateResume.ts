import { mutationField, idArg, stringArg, arg } from '@nexus/schema';
import { fileUpload } from '../../utils/fileUpload';
import analytics from '../../utils/analytics';

export const updateResumeMutationField = mutationField('updateResume', {
    type: 'Resume',
    args: {
        id: idArg(),
        name: stringArg(),
        newFileVersion: arg({
            type: 'Upload',
            required: false,
        }),
    },
    resolve: async (root, { id, name, newFileVersion }, ctx) => {
        try {
            // Verify user is associated with the company they are trying to update
            const result = await ctx.prisma.resume.findMany({
                where: { User: { id: ctx.user.id }, id },
            });
            const { Versions: resumeVersions } = await ctx.prisma.resume.findOne({
                where: { id: result[0].id },
                select: { Versions: true },
            });
            const awsFileData = await fileUpload({
                userId: ctx.user.id,
                filePathPrefix: `resumes`,
                file: newFileVersion,
                existingObjectKey: resumeVersions[0].Key,
                isImage: false,
            });

            const updatedResume = await ctx.prisma.resume.update({
                where: {
                    id: result[0].id,
                },
                data: {
                    Versions: {
                        create: awsFileData,
                    },
                    name,
                },
            });

            analytics.track({
                eventType: 'Resume updated',
                userId: ctx.user.id,
                eventProperties: {
                    id,
                },
            });

            return updatedResume;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    },
});
