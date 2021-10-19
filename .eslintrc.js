module.exports = {
    env: {
        node: true
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        // "plugin:node/recommended"
    ],
    rules: {
        'quotes': ['error', 'single'],
        'no-useless-catch': 'off',
        'no-case-declarations': 'off'
    }
};