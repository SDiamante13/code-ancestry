const { configs } = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**'],
  }
);