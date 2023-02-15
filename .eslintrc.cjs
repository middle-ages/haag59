module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
    browser: true,
    "vitest-globals/env": true,
  },

  plugins: ['@typescript-eslint', 'prettier'],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  extends: [
    'eslint:recommended',
    "plugin:vitest-globals/recommended",
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'arrow-parens': 'off',
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 80,
        arrowParens: 'avoid',
        endOfLine: 'auto',
        overrides: [{ files: ['*.html', '*.css'] }],
      },
    ],
  },
};
