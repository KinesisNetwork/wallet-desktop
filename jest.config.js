const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

const moduleNameMapper = {
  ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  '^@images/(.*)$': '<rootDir>/test/__mocks__/imageMock.js',
}

module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node', // This may need to change if we test any window dependencies
  testRegex: '/__tests__/.*.(test|spec)\\.(tsx|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'svg', 'png', 'jpg'],
  moduleNameMapper,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.ts',
  collectCoverage: true,
  rootDir: 'src',
}
