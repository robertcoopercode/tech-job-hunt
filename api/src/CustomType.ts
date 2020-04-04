import { objectType } from 'nexus';

export const StripeSubscription = objectType({
    name: 'StripeSubscription',
    definition(t) {
        t.string('status');
        t.string('clientSecret');
    },
});
