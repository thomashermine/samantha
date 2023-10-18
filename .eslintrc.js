module.exports = {
    root: true,
    ignorePatterns: [],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', 'd.ts'],
        },
      },
    },
    env: {
      node: true,
    },
    extends: [
      'airbnb-base',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint',
      'extra-rules',
    ],
    rules: {
      // Following are rules we added to the airbnb-base ruleset.
      'extra-rules/no-commented-out-code': 'warn',
    
      // Following are rules we explicitly don't want to follow.
      'no-console': 'off', // Logging is a good practice.
      'import/extensions': ['error', 'always', { // Never allow .js .ts in imports. Make transition from .js to .ts easier.
          js: 'never',
          ts: 'never',
        }],
      'no-restricted-imports': ['error', {
        name: 'pg',
        importNames: ['Pool'],
        message: 'Use Pool from src/utils/db instead.',
      }],
    },
    overrides: [
      {
        files: ['./src/**/*.test.js'],
        globals: {
          jest: true,
          it: true,
          fit: true,
          describe: true,
          afterAll: true,
          beforeAll: true,
          afterEach: true,
          expect: true,
          fail: true,
        },
      },
    ],
  };
  