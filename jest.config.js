/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globalSetup: "./src/test-setup/callSetup.js",
  preset: "ts-jest",
  testEnvironment: "node",
};
