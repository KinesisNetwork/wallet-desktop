module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node', // This may need to change if we test any window dependencies
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@services(.*)': '<rootDir>/src/services$1',
    '@components(.*)': '<rootDir>/src/components$1',
    '@containers(.*)': '<rootDir>/src/containers$1',
    '@helpers(.*)': '<rootDir>/src/helpers$1',
    '@types(.*)': '<rootDir>/src/types$1',
    '@store(.*)': '<rootDir>/src/store$1',
    '@actions(.*)': '<rootDir>/src/store/actions$1',
    '@selectors(.*)': '<rootDir>/src/store/selectors$1',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
