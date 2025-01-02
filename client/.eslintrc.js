module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        // 'plugin:react-hooks/recommended',
        'prettier',
        'plugin:@tanstack/eslint-plugin-query/recommended'
    ],
    ignorePatterns: [
        'dist',
        'node_modules',
        'package.json',
        'package-lock.json'
    ],
    overrides: [
        {
            env: {
                node: true,
                jest: true
            },
            files: ['**/*.test.js', '**/*.test.jsx'],
            parserOptions: {
                sourceType: 'module'
            }
        }
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react-refresh', 'react', 'prettier', '@tanstack/query'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true }
        ],
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off'
    }
};
