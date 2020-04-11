import { mutationField } from '@nexus/schema';

export const logoutMutationField = mutationField('logout', {
    type: 'Boolean',
    resolve: (_, _args, ctx) => {
        ctx.response.clearCookie('token', {
            domain: process.env.API_COOKIE_DOMAIN,
        });

        return true;
    },
});
