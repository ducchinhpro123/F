module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Error prevention
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-duplicate-imports': 'error',
    
    // Code style
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    
    // Best practices
    'eqeqeq': 'error',
    'curly': ['error', 'all'],
    'no-var': 'error',
    'prefer-const': 'error',
    'object-shorthand': 'error',
  },
  overrides: [
    // Override specific rules for certain file patterns
    {
      files: ['*.spec.js', '*.test.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};