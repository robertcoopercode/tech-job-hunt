import { mutationField, idArg, stringArg, arg } from '@nexus/schema';
import { fileUpload } from '../../utils/fileUpload';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const updateResumeMutationField = mutationField('updateResume', {
    type: 'Resume',
    args: {
        id: idArg({ required: true }),
        name: stringArg(),
        newFileVersion: arg({
            type: 'Upload',
            required: false,
        }),
    },
    resolve: async (root, { id, name, newFileVersion }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        // Verify user is associated with the company they are trying to update
        const result = await ctx.prisma.resume.findMany({
            where: { User: { id: ctx.user.id }, id },
        });
        const resume = await ctx.prisma.resume.findOne({
            where: { id: result[0].id },
            select: { Versions: true },
        });
        if (resume === null) {
            throw Error('Resume not found');
        }
        const awsFileData = await fileUpload({
            userId: ctx.user.id,
            filePathPrefix: `resumes`,
            file: newFileVersion,
            existingObjectKey: resume.Versions[0].Key,
            isImage: false,
        });

        const updatedResume = await ctx.prisma.resume.update({
            where: {
                id: result[0].id,
            },
            data: {
                Versions: {
                    create: awsFileData === null ? undefined : awsFileData,
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
    },
});
