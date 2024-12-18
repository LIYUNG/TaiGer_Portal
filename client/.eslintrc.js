module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:@tanstack/eslint-plugin-query/recommended'
  ],
  overrides: [
    {
      env: {
        node: true,
        jest: true
      },
      files: ['**/*.test.js', '**/*.test.jsx'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
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
