module.exports = {
  // Indicates that the test environment is a Node.js environment
  testEnvironment: 'node',

  // A list of directories that Jest should use to search for test files
  roots: ['<rootDir>/src'],

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

  // The module file extensions for importing modules in your tests
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
