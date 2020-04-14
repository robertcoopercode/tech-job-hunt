import { mutationField, idArg } from '@nexus/schema';
import { emptyS3Directory } from '../../utils/emptyS3Directory';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const deleteCompanyMutationField = mutationField('deleteCompany', {
    type: 'Company',
    args: {
        id: idArg({ required: true }),
    },
    resolve: async (_, { id }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);

        const company = await ctx.prisma.company.findOne({
            where: { id },
            select: { User: true, Image: true },
        });
        if (company === null) {
            throw Error('Company not found');
        }
        const companyUser = company.User;

        if (companyUser === null) {
            throw Error('User not found');
        }

        if (companyUser.id !== ctx.user.id) {
            throw Error('Company does not belong to user');
        }

        const companyImage = company.Image;

        const deletedCompany = await ctx.prisma.company.delete({ where: { id } });

        if (companyImage !== null) {
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
