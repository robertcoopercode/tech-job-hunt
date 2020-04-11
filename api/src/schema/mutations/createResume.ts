import { mutationField, stringArg, arg } from '@nexus/schema';
import { fileUpload } from '../../utils/fileUpload';
import analytics from '../../utils/analytics';

export const createResumeMutationField = mutationField('createResume', {
    type: 'Resume',
    args: {
        name: stringArg(),
        file: arg({
            type: 'Upload',
            required: false,
        }),
    },
    resolve: async (root, { name, file }, ctx) => {
        try {
            const awsFileData = await fileUpload({
                userId: ctx.user.id,
                filePathPrefix: `resumes`,
                file,
                isImage: false,
            });

            const createdResume = await ctx.prisma.resume.create({
                data: {
                    User: { connect: { id: ctx.user.id } },
                    name,
                    Versions: {
                        create: awsFileData,
                    },
                },
            });

            analytics.track({
                eventType: 'Resume created',
                userId: ctx.user.id,
                eventProperties: {
                    id: createdResume.id,
                },
            });

            return createdResume;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    },
});
