const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/components/**/?(*.)+(snapshot|spec|test).js?(x)',
    '**/utilities/**/?(*.)+(spec|test).js?(x)',
  ],
  collectCoverageFrom: [
    '**/components/**/*.js?(x)',
    '**/utilities/**/*.js?(x)'
  ],
  // Coverage threshold limit
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
module.exports = createJestConfig(customJestConfig);
