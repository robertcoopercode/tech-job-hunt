import { mutationField } from '@nexus/schema';
import { catchAsyncErrors } from '../../utils/catchErrors';
import analytics from '../../utils/analytics';
import { stripe } from '../../utils/stripe';

export const cancelSubscriptionMutationField = mutationField('cancelSubscription', {
    type: 'User',
    resolve: async (_, _args, ctx) => {
        return catchAsyncErrors(async () => {
            const user = await ctx.prisma.user.findOne({
                where: { id: ctx.user.id },
                select: { Billing: { select: { stripeCustomerId: true } } },
            });

            // Get current subscription
            const currentSubscription = await stripe.subscriptions.list({
                customer: user.Billing.stripeCustomerId,
                limit: 1,
                status: 'active',
            });

            const subscriptionId = currentSubscription.data[0].id;

            // Update the current subscription to cancel at the end of the period
            const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });

            const updatedUser = await ctx.prisma.user.update({
                where: { id: ctx.user.id },
                data: {
                    Billing: {
                        update: {
                            willCancelAtEndOfPeriod: updatedSubscription.cancel_at_period_end,
                        },
                    },
                },
            });

            analytics.track({ eventType: 'Subscription cancelled', userId: ctx.user.id });

            return updatedUser;
        });
    },
});
