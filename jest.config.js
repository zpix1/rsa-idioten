module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '^.+\\.(js|jsx)?$': 'babel-jest'
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    // snapshotSerializers: ['jest-serializer-vue'],
    testMatch: [
      '<rootDir>/(tests/unit/*.spec.js)'
    ],
    transformIgnorePatterns: ['<rootDir>/node_modules/']
  };