/**
 * @see https://prettier.io/docs/en/options
 * @type {import("prettier").Config}
 */
const config = {
    printWidth: 150,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: false,
    trailingComma: 'all',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',
    proseWrap: 'preserve',
    endOfLine: 'lf',
    overrides: [
        {
            files: ['*.json', '*.json5', '*.jsonc'],
            options: {
                tabWidth: 2,
                trailingComma: 'none',
            },
        },
        {
            files: ['*.css'],
            options: {
                singleQuote: false,
            },
        },
        {
            files: ['*.yaml', '*.yml'],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.md',
            options: {
                tabWidth: 2,
            },
        },
    ],
};

// noinspection JSUnusedGlobalSymbols
export default config;
