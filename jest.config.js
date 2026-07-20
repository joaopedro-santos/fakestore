module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: ['**/*.spec.ts'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@ionic/angular/standalone$': '<rootDir>/src/test/mocks/ionic-standalone.mock.ts',
    '^@ionic/angular$': '<rootDir>/src/test/mocks/ionic-angular.mock.ts',
  },
  testEnvironment: 'jsdom',
};
