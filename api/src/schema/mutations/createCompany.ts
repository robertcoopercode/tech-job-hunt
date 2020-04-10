import { mutationField, stringArg, arg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { catchAsyncErrors } from '../../utils/catchErrors';
import { fileUpload } from '../../utils/fileUpload';

export const createCompanyMutationField = mutationField('createCompany', {
    type: 'Company',
    args: {
        name: stringArg(),
        file: arg({
            type: 'Upload',
            required: false,
        }),
    },
    resolve: async (_, { name, file }, ctx) => {
        return catchAsyncErrors(async () => {
            const awsFileData = await fileUpload({ userId: ctx.user.id, filePathPrefix: `companies`, file });

            // Then create the company entry in Prisma, storing the S3 file info
            const createdCompany = await ctx.prisma.company.create({
                data: {
                    User: { connect: { id: ctx.user.id } },
                    name,
                    Image: { create: awsFileData },
                },
            });

            analytics.track({
                eventType: 'Company created',
                userId: ctx.user.id,
                eventProperties: {
                    id: createdCompany.id,
                },
            });

            return createdCompany;
        });
    },
});
