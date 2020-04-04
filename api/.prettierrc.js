// This configuration should be the exact same as the one found at the root of the repository
module.exports = {
    singleQuote: true,
    semi: true,
    printWidth: 120,
    trailingComma: 'es5',
    overrides: [
        {
            files: '*.{js,ts,jsx,tsx,json,html}',
            options: {
                tabWidth: 4,
            },
        },
    ],
};
