import { inputObjectType } from '@nexus/schema';

export const JobApplicationOrderByInput = inputObjectType({
    name: 'JobApplicationOrderByInput',
    definition(t) {
        t.field('updatedAt', {
            type: 'OrderByArg',
        });
    },
});
