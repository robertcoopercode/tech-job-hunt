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
