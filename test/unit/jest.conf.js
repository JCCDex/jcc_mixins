const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    "node",
    "json"
  ],
  silent: true,
  verbose: true,
  testURL: 'http://locallhost/',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  testMatch: ['<rootDir>/test/unit/specs/*.spec.js'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ["jest-localstorage-mock", "<rootDir>/test/unit/setup.js", "jest-canvas-mock"],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleDirectories: ["node_modules"],
  collectCoverageFrom: [
    'src/withdraw/contract.js',
    '!**/node_modules/**'
  ]
}