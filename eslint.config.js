// eslint-disable-next-line @typescript-eslint/no-require-imports,import/no-extraneous-dependencies
const { FlatCompat } = require('@eslint/eslintrc');
// eslint-disable-next-line @typescript-eslint/no-require-imports,import/no-extraneous-dependencies
const js = require('@eslint/js');
// eslint-disable-next-line @typescript-eslint/no-require-imports,import/no-extraneous-dependencies
const tsPlugin = require('@typescript-eslint/eslint-plugin');
// eslint-disable-next-line @typescript-eslint/no-require-imports,import/no-extraneous-dependencies
const tsParser = require('@typescript-eslint/parser');
// eslint-disable-next-line @typescript-eslint/no-require-imports,import/no-extraneous-dependencies
const tsdocPlugin = require('eslint-plugin-tsdoc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { ignores: ['dist/**', 'docs/**', 'examples/**', 'webpack/**'] },

  // Bridge airbnb-base (ESLint ≤8 only) into flat config
  ...compat.extends('airbnb-base'),

  // Global settings and rule overrides
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: { extensions: ['.js', '.ts'] },
      },
    },
    plugins: { tsdoc: tsdocPlugin },
    rules: {
      'tsdoc/syntax': 'warn',
      indent: ['error', 2, { SwitchCase: 1 }],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'linebreak-style': ['error', 'unix'],
      'spaced-comment': 'off',
      'func-names': 'off',
      'no-shadow': 'off',
      'class-methods-use-this': 'off',
      'dot-notation': 'off',
      'no-param-reassign': ['error', { props: false }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      camelcase: ['error', { allow: ['SendEmailV3_1'] }],
    },
  },

  // @typescript-eslint v8 flat recommended configs (scoped to TS files)
  tsPlugin.configs['flat/eslint-recommended'],
  ...tsPlugin.configs['flat/recommended'],

  // TypeScript-specific rule overrides
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tsParser },
    plugins: {
      '@typescript-eslint': tsPlugin,
      tsdoc: tsdocPlugin,
    },
    rules: {
      'import/extensions': 0,
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-shadow': 'off',
      // ban-types was removed in v8; no-empty-object-type is its replacement
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
