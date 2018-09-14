module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node', // This may need to change if we test any window dependencies
  testRegex: '/__tests__/.*.(test|spec)\\.(tsx|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'svg', 'png', 'jpg'],
  moduleNameMapper: {
    '@services(.*)': '<rootDir>/src/services$1',
    '@components(.*)': '<rootDir>/src/components$1',
    '@containers(.*)': '<rootDir>/src/containers$1',
    '@helpers(.*)': '<rootDir>/src/helpers$1',
    '@types(.*)': '<rootDir>/src/types$1',
    '@store(.*)': '<rootDir>/src/store$1',
    '@actions(.*)': '<rootDir>/src/store/actions$1',
    '@selectors(.*)': '<rootDir>/src/store/selectors$1',
    '@images(.*)': '<rootDir>/src/test/__mocks__/imageMock.js'
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.ts',
}
