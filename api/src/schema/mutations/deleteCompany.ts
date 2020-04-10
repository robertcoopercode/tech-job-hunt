import { mutationField, idArg } from '@nexus/schema';
import { emptyS3Directory } from '../../utils/emptyS3Directory';
import analytics from '../../utils/analytics';

export const deleteCompanyMutationField = mutationField('deleteCompany', {
    type: 'Company',
    args: {
        id: idArg(),
    },
    resolve: async (_, { id }, ctx) => {
        if (!ctx.user.id) {
            return;
        }

        const { User: companyUser } = await ctx.prisma.company.findOne({
            where: { id },
            select: { User: true },
        });
        if (companyUser.id !== ctx.user.id) {
            return;
        }

        const { Image: companyImage } = await ctx.prisma.company.findOne({
            where: { id },
            select: { Image: true },
        });
        const deletedCompany = await ctx.prisma.company.delete({ where: { id } });

        if (companyImage) {
            // Delete all company images from S3, including all resized images
            const match = companyImage.s3Url.match(/.*\.amazonaws.com\/(.*\/companies\/[^\/]*)\/.*/);
            if (match) {
                await emptyS3Directory(match[1]);
            }
        }

        analytics.track({
            eventType: 'Company deleted',
            userId: ctx.user.id,
            eventProperties: {
                id,
            },
        });

        return deletedCompany;
    },
});
