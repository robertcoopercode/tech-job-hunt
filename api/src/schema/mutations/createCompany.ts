import { mutationField, stringArg, arg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { fileUpload } from '../../utils/fileUpload';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const createCompanyMutationField = mutationField('createCompany', {
    type: 'Company',
    args: {
        name: stringArg({ required: true }),
        file: arg({
            type: 'Upload',
            required: false,
        }),
    },
    resolve: async (_, { name, file }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);

        const awsFileData = await fileUpload({ userId: ctx.user.id, filePathPrefix: `companies`, file });

        // Then create the company entry in Prisma, storing the S3 file info
        const createdCompany = await ctx.prisma.company.create({
            data: {
                User: { connect: { id: ctx.user.id } },
                name,
                // Cannot pass null to create or it throws an error: https://github.com/prisma/prisma-client-js/issues/459
                ...(awsFileData === null ? {} : { Image: { create: awsFileData } }),
            },
        });

        if (awsFileData) {
            analytics.track({
                eventType: 'Company created',
                userId: ctx.user.id,
                eventProperties: {
                    id: createdCompany.id,
                },
            });
        }

        return createdCompany;
    },
});
