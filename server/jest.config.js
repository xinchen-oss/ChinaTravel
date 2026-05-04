export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setEnv.js'],
  setupFilesAfterEach: [],
  testTimeout: 30000,
  verbose: true,
  collectCoverageFrom: [
    'src/utils/**/*.js',
    'src/middleware/**/*.js',
    'src/controllers/**/*.js',
  ],
};
