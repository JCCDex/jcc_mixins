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
    '^@/(.*)$': '<rootDir>/$1',
    '^canvas$': '<rootDir>/node_modules/jest-canvas-mock',
    // ethers v6 uses package.json "exports" which Jest 26 doesn't support — map each subpath manually
    '^ethers/crypto$': '<rootDir>/node_modules/ethers/lib.commonjs/crypto/index.js',
    '^ethers/abi$': '<rootDir>/node_modules/ethers/lib.commonjs/abi/index.js',
    '^ethers/address$': '<rootDir>/node_modules/ethers/lib.commonjs/address/index.js',
    '^ethers/constants$': '<rootDir>/node_modules/ethers/lib.commonjs/constants/index.js',
    '^ethers/contract$': '<rootDir>/node_modules/ethers/lib.commonjs/contract/index.js',
    '^ethers/hash$': '<rootDir>/node_modules/ethers/lib.commonjs/hash/index.js',
    '^ethers/providers$': '<rootDir>/node_modules/ethers/lib.commonjs/providers/index.js',
    '^ethers/transaction$': '<rootDir>/node_modules/ethers/lib.commonjs/transaction/index.js',
    '^ethers/utils$': '<rootDir>/node_modules/ethers/lib.commonjs/utils/index.js',
    '^ethers/wallet$': '<rootDir>/node_modules/ethers/lib.commonjs/wallet/index.js',
    '^ethers/wordlists$': '<rootDir>/node_modules/ethers/lib.commonjs/wordlists/index.js',
    '^ethers$': '<rootDir>/node_modules/ethers/lib.commonjs/index.js'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'babel-jest',
    '.*\\.(vue)$': '@vue/vue2-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  testMatch: ['<rootDir>/test/unit/specs/*.spec.js'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ["jest-localstorage-mock", "<rootDir>/test/unit/setup.js", "jest-canvas-mock"],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\](?!jcc-moac-utils).+\\.(js|jsx|ts|tsx)$"],
  moduleDirectories: ["node_modules"],
  collectCoverageFrom: [
    'src/withdraw/contract.js',
    'src/deposit/*.js',
    '!**/node_modules/**'
  ]
}