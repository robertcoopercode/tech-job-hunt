import { mutationField } from '@nexus/schema';
import analytics from '../../utils/analytics';

export const completeOnboardingMutationField = mutationField('completeOnboarding', {
    type: 'Boolean',
    resolve: async (_, _args, ctx) => {
        await ctx.prisma.user.update({
            where: { id: ctx.user.id },
            data: { hasCompletedOnboarding: true },
        });
        analytics.track({ eventType: 'Onboarding completed', userId: ctx.user.id });
        return true;
    },
});
