module.exports = {
    client: {
        includes: ['{pages,components,graphql,utils}/**/*.{tsx,ts}'],
        localSchemaFile: 'graphql-schema.json',
        service: {
            localSchemaFile: '../api/src/generated/schema.graphql',
        },
    },
};
