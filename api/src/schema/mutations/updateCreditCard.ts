import { mutationField, arg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { stripe } from '../../utils/stripe';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const updateCreditCardMutationField = mutationField('updateCreditCard', {
    type: 'User',
    args: {
        card: arg({
            type: 'CardUpdateInput',
            required: true,
        }),
    },
    resolve: async (_, { card }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        const { expMonth, expYear, last4Digits, brand, stripePaymentMethodId } = card;
        const user = await ctx.prisma.user.findOne({
            where: { id: ctx.user.id },
            select: { Billing: { select: { stripeCustomerId: true } } },
        });

        if (user?.Billing?.stripeCustomerId === null || user?.Billing?.stripeCustomerId === undefined) {
            throw Error('User does not have an associated Stripe Customer Id');
        }

        if (stripePaymentMethodId === undefined || stripePaymentMethodId === null) {
            throw Error('Payment method ID not found');
        }

        // Attach the new payment method with the current user in stripe
        await stripe.paymentMethods.attach(stripePaymentMethodId, { customer: user.Billing.stripeCustomerId });
        // Update the customer's default payment method in stripe
        await stripe.customers.update(user.Billing.stripeCustomerId, {
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
    },
});
