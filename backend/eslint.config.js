// ESLint 9 flat config for the backend (CommonJS, Node).
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_|^next$' }],
      'no-console': 'off',
      eqeqeq: ['warn', 'smart'],
    },
  },
  { ignores: ['node_modules/**'] },
];
