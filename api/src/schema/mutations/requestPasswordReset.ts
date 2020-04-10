import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { mutationField, stringArg } from '@nexus/schema';
import { sendEmail } from '../../utils/mail';
import analytics from '../../utils/analytics';

export const requestPasswordResetMutationField = mutationField('requestPasswordReset', {
    type: 'Boolean',
    args: {
        email: stringArg(),
    },
    resolve: async (_, { email }, ctx) => {
        const user = await ctx.prisma.user.findOne({ where: { email } });
        if (!user) {
            throw new Error(`No user found for ${email}`);
        }

        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        await ctx.prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });

        await sendEmail({
            subject: 'Your password reset token',
            toAddress: [user.email],
            text: `Your Password Reset Token is here!
      \n\n
      <a href="${process.env.COMMON_FRONTEND_URL}/reset-password?resetToken=${resetToken}">Click Here to Reset</a>`,
        });

        analytics.track({ eventType: 'Reset password request' });

        return true;
    },
});
