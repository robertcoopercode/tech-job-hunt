import { mutationField } from '@nexus/schema';
import { generateToken } from '../../utils/generateToken';
import { sendEmailConfirmationEmail } from '../../utils/mail';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const requestVerifyEmailMutationField = mutationField('requestVerifyEmail', {
    type: 'Boolean',
    resolve: async (_, _args, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        const emailConfirmationToken = await generateToken();
        const user = await ctx.prisma.user.findOne({ where: { id: ctx.user.id } });
        if (user === null) {
            throw Error('User does not exist');
        }
        const { email } = user;
        await ctx.prisma.user.update({
            where: {
                email,
            },
            data: {
                emailConfirmationToken,
            },
        });

        await sendEmailConfirmationEmail(email, emailConfirmationToken);

        analytics.track({ eventType: 'Request verify email', userId: ctx.user.id });

        return true;
    },
});
