import { inputObjectType } from '@nexus/schema';

export const JobApplicationOrderByInput = inputObjectType({
    name: 'JobApplicationOrderByInput',
    definition(t) {
        t.field('updatedAt', {
            type: 'OrderByArg',
        });
        t.field('applicationStatus', {
            type: 'OrderByArg',
        });
        t.field('companyName', {
            type: 'OrderByArg',
        });
        t.field('locationName', {
            type: 'OrderByArg',
        });
        t.field('position', {
            type: 'OrderByArg',
        });
    },
});
