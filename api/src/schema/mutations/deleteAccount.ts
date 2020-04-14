import { mutationField } from '@nexus/schema';
import { emptyS3Directory } from '../../utils/emptyS3Directory';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const deleteAccountMutationField = mutationField('deleteAccount', {
    type: 'User',
    resolve: async (_, _args, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        // Delete all data for the user in S3
        await emptyS3Directory(`users/${ctx.user.id}`);

        // Delete the user in the database using Prisma (will trigger a cascading delete of all user data)
        const deletedUser = await ctx.prisma.user.delete({ where: { id: ctx.user.id } });

        analytics.track({ eventType: 'Account deleted', userId: ctx.user.id });

        return deletedUser;
    },
});
