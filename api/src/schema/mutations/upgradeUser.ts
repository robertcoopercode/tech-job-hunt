import { mutationField, stringArg, arg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { stripe } from '../../utils/stripe';
import { billingFrequencyByPlanId } from '../../utils/constants';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const upgradeUserMutationField = mutationField('upgradeUser', {
    type: 'StripeSubscription',
    args: {
        paymentMethodId: stringArg({ required: true }),
        email: stringArg({ required: true }),
        planId: stringArg({ required: true }),
        card: arg({
            type: 'CardUpdateWithoutBillingInfoDataInput',
            required: true,
        }),
    },
    resolve: async (_, { paymentMethodId, email, planId, card }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        // Make sure the plan ID is valid
        if (
            planId !== process.env.COMMON_STRIPE_YEARLY_PLAN_ID &&
            planId !== process.env.COMMON_STRIPE_MONTHLY_PLAN_ID
        ) {
            throw Error('Unknown planId');
        }

        // Look if current user already has a stripe customer ID before trying to create a new customer in Stripe
        const billingInfo = await ctx.prisma.user
            .findOne({
                where: { id: ctx.user.id },
            })
            .Billing();
        const cardDetails = await ctx.prisma.user
            .findOne({ where: { id: ctx.user.id } })
            .Billing()
            .Card();
        let stripeCustomerId, brand, expMonth, expYear, last4Digits, stripePaymentMethodId;

        if (cardDetails) {
            ({ brand, expMonth, expYear, last4Digits, stripePaymentMethodId } = cardDetails);
        }

        if (billingInfo) {
            ({ stripeCustomerId } = billingInfo);
        }

        // If the user is already premium, then return early to prevent charging them for a new subscription
        if (billingInfo && billingInfo.isPremiumActive) {
            throw Error('User is already on a premium membership');
        }

        // If the user doesn't have a stripe customer ID, create one
        if (!stripeCustomerId) {
            // This creates a new Customer in Stripe and attaches the PaymentMethod in one API call.
            const customer = await stripe.customers.create({
                payment_method: paymentMethodId,
                email: email,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
            // Set the card details variables to what was provided through the GraphQL request
            ({ expMonth, expYear, last4Digits, brand } = card);
            stripeCustomerId = customer.id;
        } else {
            // If the current payment method (i.e. card) is not the same as the one associated with the user, then make sure to update the default payment method
            if (stripePaymentMethodId !== undefined && stripePaymentMethodId !== paymentMethodId) {
                await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });
                await stripe.customers.update(stripeCustomerId, {
                    invoice_settings: {
                        default_payment_method: paymentMethodId,
                    },
                });
            }
        }

        // Store the Stripe custom ID in our database
        await ctx.prisma.user.update({
            where: { id: ctx.user.id },
            data: {
                Billing: {
                    upsert: {
                        create: {
                            stripeCustomerId,
                        },
                        update: {
                            stripeCustomerId,
                        },
                    },
                },
            },
        });

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{ plan: planId }],
            expand: ['latest_invoice.payment_intent'],
        });

        const isSubscriptionPaymentConfirmed =
            typeof subscription.latest_invoice === 'object' &&
            typeof subscription.latest_invoice?.payment_intent === 'object' &&
            subscription.latest_invoice?.payment_intent?.status === 'succeeded';

        if (expMonth === undefined || expMonth === null) {
            throw Error('Missing expiration month');
        }
        if (expYear === undefined || expYear === null) {
            throw Error('Missing expiration year');
        }
        if (last4Digits === undefined || last4Digits === null) {
            throw Error('Missing last 4 digits of credit card');
        }
        if (brand === undefined || brand === null) {
            throw Error('Missing credit card brand');
        }

        // Store stripe subscription details in database
        await ctx.prisma.user.update({
            where: { id: ctx.user.id },
            data: {
                Billing: {
                    upsert: {
                        create: {
                            stripeCustomerId: stripeCustomerId,
                            stripeSubscriptionId: subscription.id,
                            startOfBillingPeriod: subscription.current_period_start,
                            endOfBillingPeriod: subscription.current_period_end,
                            isPremiumActive: isSubscriptionPaymentConfirmed,
                            billingFrequency: billingFrequencyByPlanId[planId],
                            Card: {
                                create: {
                                    expMonth,
                                    expYear,
                                    last4Digits,
                                    brand,
                                    stripePaymentMethodId: paymentMethodId,
                                },
                            },
                        },
                        update: {
                            stripeCustomerId: stripeCustomerId,
                            stripeSubscriptionId: subscription.id,
                            startOfBillingPeriod: subscription.current_period_start,
                            endOfBillingPeriod: subscription.current_period_end,
                            isPremiumActive: isSubscriptionPaymentConfirmed,
                            billingFrequency: billingFrequencyByPlanId[planId],
                            Card: {
                                upsert: {
                                    create: {
                                        expMonth,
                                        expYear,
                                        last4Digits,
                                        brand,
                                        stripePaymentMethodId: paymentMethodId,
                                    },
                                    update: {
                                        expMonth,
                                        expYear,
                                        last4Digits,
                                        brand,
                                        stripePaymentMethodId: paymentMethodId,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (isSubscriptionPaymentConfirmed) {
            analytics.track({
                eventType: 'Premium upgrade',
                userId: ctx.user.id,
                eventProperties: {
                    billingFrequency: billingFrequencyByPlanId[planId],
                },
            });
        }
        // eslint-disable-next-line no-console
        console.log('Created stripe subscription', { subscription });

        if (
            typeof subscription.latest_invoice === 'object' &&
            typeof subscription.latest_invoice?.payment_intent === 'object' &&
            subscription.latest_invoice?.payment_intent?.client_secret !== undefined
        ) {
            return {
                status: subscription.latest_invoice?.payment_intent?.status,
                clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
            };
        }

        throw new Error('Unable to retrieve Stripe subscription information');
    },
});
