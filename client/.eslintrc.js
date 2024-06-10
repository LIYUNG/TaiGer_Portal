module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
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
  plugins: ['react'],
  rules: {
    'react/prop-types': 'off'
  }
};
