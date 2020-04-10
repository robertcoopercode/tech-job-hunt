import { mutationField } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { stripe } from '../../utils/stripe';
import { billingFrequencyByPlanId } from '../../utils/constants';

export const checkSubscriptionPaymentHasSucceededMutationField = mutationField('checkSubscriptionPaymentHasSucceeded', {
    type: 'Boolean',
    resolve: async (_, __, ctx) => {
        const stripeSubscriptionId = await ctx.prisma.user.findOne({
            where: { id: ctx.user.id },
            select: { Billing: { select: { stripeSubscriptionId: true } } },
        });
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId.Billing.stripeSubscriptionId, {
            expand: ['latest_invoice.payment_intent'],
        });

        const isSubscriptionPaymentConfirmed =
            typeof subscription.latest_invoice === 'object' &&
            typeof subscription.latest_invoice.payment_intent === 'object' &&
            subscription.latest_invoice.payment_intent.status === 'succeeded';

        await ctx.prisma.user.update({
            where: { id: ctx.user.id },
            data: {
                Billing: {
                    update: {
                        isPremiumActive: isSubscriptionPaymentConfirmed,
                    },
                },
            },
        });

        if (isSubscriptionPaymentConfirmed) {
            analytics.track({
                eventType: 'Premium upgrade',
                userId: ctx.user.id,
                eventProperties: {
                    billingFrequency: billingFrequencyByPlanId[subscription.plan.id],
                },
            });
        }

        return isSubscriptionPaymentConfirmed;
    },
});
