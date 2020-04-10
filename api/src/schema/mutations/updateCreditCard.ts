import { mutationField, arg } from '@nexus/schema';
import { catchAsyncErrors } from '../../utils/catchErrors';
import analytics from '../../utils/analytics';
import { stripe } from '../../utils/stripe';

export const updateCreditCardMutationField = mutationField('updateCreditCard', {
    type: 'User',
    args: {
        card: arg({
            type: 'CardUpdateInput',
            required: true,
        }),
    },
    resolve: async (_, { card }, ctx) => {
        return catchAsyncErrors(async () => {
            const { expMonth, expYear, last4Digits, brand, stripePaymentMethodId } = card;
            const {
                Billing: { stripeCustomerId },
            } = await ctx.prisma.user.findOne({
                where: { id: ctx.user.id },
                select: { Billing: { select: { stripeCustomerId: true } } },
            });

            // Attach the new payment method with the current user in stripe
            await stripe.paymentMethods.attach(stripePaymentMethodId, { customer: stripeCustomerId });
            // Update the customer's default payment method in stripe
            await stripe.customers.update(stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: stripePaymentMethodId,
                },
            });

            const updatedUser = await ctx.prisma.user.update({
                where: { id: ctx.user.id },
                data: {
                    Billing: {
                        update: {
                            Card: {
                                update: {
                                    expMonth,
                                    expYear,
                                    last4Digits,
                                    brand,
                                    stripePaymentMethodId,
                                },
                            },
                        },
                    },
                },
            });

            analytics.track({ eventType: 'Credit card updated', userId: ctx.user.id });

            return updatedUser;
        });
    },
});
