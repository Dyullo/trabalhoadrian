const path = require('path');

const rootDir = path.resolve(__dirname, '..');

module.exports = {
  rootDir,
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/backend/**/*.test.js',
    '<rootDir>/tests/frontend/**/*.test.js'
  ],
  coverageDirectory: '<rootDir>/tests/coverage',
  collectCoverageFrom: [
    '<rootDir>/backend/server.js',
    '<rootDir>/frontend/public/script.js'
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html', 'lcov']
};
