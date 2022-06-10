module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'breaking',
        'security',
        'feature',
        'deprecate',
        'remove',
        'fix',
        'test',
        'build',
        'docs',
        'other',
        'chore',
      ],
    ],
    'subject-case': [
      2,
      'always',
      'sentence-case',
    ],
  },
};
