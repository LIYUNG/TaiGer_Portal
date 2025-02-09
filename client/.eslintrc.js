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
        'react/react-in-jsx-scope': 'off',
        'react/prefer-stateless-function': 'error',
        'react/button-has-type': 'error',
        'react/no-unused-prop-types': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-no-script-url': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-unstable-nested-components': [
            'error',
            { allowAsProps: true }
        ],
        'react/jsx-fragments': 'error',
        // 'react/destructuring-assignment': [
        //     'error',
        //     'always',
        //     { destructureInSignature: 'always' }
        // ],
        // 'react/jsx-no-leaked-render': [
        //     'error',
        //     { validStrategies: ['ternary'] }
        // ],
        // 'react/jsx-max-depth': ['error', { max: 5 }],
        // 'react/function-component-definition': [
        //     'warn',
        //     { namedComponents: 'arrow-function' }
        // ],
        // 'react/jsx-key': [
        //     'error',
        //     {
        //         checkFragmentShorthand: true,
        //         checkKeyMustBeforeSpread: true,
        //         warnOnDuplicates: true
        //     }
        // ],
        'react/jsx-no-useless-fragment': 'warn',
        'react/jsx-curly-brace-presence': 'warn',
        // 'react/no-typos': 'warn',
        // 'react/display-name': 'warn',
        'react/self-closing-comp': 'warn',
        'react/jsx-sort-props': 'warn',
        // 'react/jsx-one-expression-per-line': 'off'
    }
};
