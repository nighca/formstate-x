const { TS_TRANSFORM_PATTERN } = require('ts-jest')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/src/testSetup.ts'
  ],
  roots: ['<rootDir>/src'],
  transform: {
    // ...createDefaultPreset().transform,
    // [...]
    [TS_TRANSFORM_PATTERN]: [
      "ts-jest",
      {
        // 使用特定的 tsconfig，指定 compile target 为 es6
        // 以避免 class extends 时 super() 调用导致无法覆盖的 branch
        // 详情见 https://github.com/microsoft/TypeScript/issues/13029
        tsconfig: {
          target: 'es6'
        }
      }
    ]
  },
}
