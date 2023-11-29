
export default {
  preset: 'ts-jest',
  // Note resolver required only when using imports with extensions
  resolver: 'jest-ts-webcompat-resolver',
  testEnvironment: 'node',
  rootDir: './',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json'
      }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "^@domain/(.*)$": [
      "<rootDir>/src/domain/$1"
    ],
    "^@application/(.*)$": [
      "<rootDir>/src/application/$1"
    ],
    "^@infrastructure/(.*)$": [
      "<rootDir>/src/infrastructure/$1"
    ],
    "^@config$/(.*)": [
      "<rootDir>/src/config/$1"
    ],
  },
  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
};
