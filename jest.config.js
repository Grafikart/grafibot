module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  testMatch: [
    '**/test/**/*.test.(ts|js)'
  ],
  testEnvironment: 'node',
  preset: 'ts-jest'
}
