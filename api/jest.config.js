module.exports = {
  preset: "@shelf/jest-mongodb",
  watchPathIgnorePatterns: ["globalConfig"],
  testRegex: "/__tests__/.*\\.(test|spec)\\.jsx?$",
  setupFilesAfterEnv: ["jest-extended"],
  testTimeout: 60000,
};
