module.exports = {
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig'],
  testRegex: '/__tests__/.*\\.(test|spec)\\.jsx?$',
  setupFilesAfterEnv: ['jest-extended'],
  transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
  testTimeout: 100000
};
