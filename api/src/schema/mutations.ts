import { mutationType } from '@nexus/schema';

export const Mutation = mutationType({
    definition(t) {
        // The following aliased mutations are only used in order to generate and use types for the other mutations
        // The queries will not be accessible since they are explicitly blocked by graphql-shield in the index.ts file
        // https://github.com/graphql-nexus/nexus-schema-plugin-prisma/issues/381#issuecomment-511349178
        t.crud.updateOneCard({ alias: '_updateOneCard' });
        t.crud.updateOneGoogleMapsLocation({ alias: '_updateOneGoogleMapsLocation' });
        t.crud.createOneGoogleMapsLocation({ alias: '_createOneGoogleMapsLocation' });
    },
});
