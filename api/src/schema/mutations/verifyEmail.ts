import { mutationField, stringArg } from '@nexus/schema';
import analytics from '../../utils/analytics';

export const verifyEmailMutationField = mutationField('verifyEmail', {
    type: 'Boolean',
    args: {
        emailToken: stringArg(),
    },
    resolve: async (_, { emailToken }, ctx) => {
        const [user] = await ctx.prisma.user.findMany({
            where: {
                emailConfirmationToken: emailToken,
            },
        });

        if (!user) {
            throw new Error('This token is either invalid or expired!');
        }

        await ctx.prisma.user.update({
            where: { email: user.email },
            data: {
                emailConfirmationToken: null,
                hasVerifiedEmail: true,
            },
        });

        analytics.track({ eventType: 'Email verified' });

        return true;
    },
});
