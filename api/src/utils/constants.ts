import { BillingFrequency } from '@prisma/client';

export const freeTierJobLimit = 10;
export const cookieDuration = 1000 * 60 * 60 * 24 * 365; // 1 year

export const billingFrequencyByPlanId: { [planId: string]: BillingFrequency } = {
    [process.env.COMMON_STRIPE_YEARLY_PLAN_ID]: BillingFrequency.YEARLY,
    [process.env.COMMON_STRIPE_MONTHLY_PLAN_ID]: BillingFrequency.MONTHLY,
};
