module.exports = {
  'env': {
    'commonjs': true,
    'es2020': true,
    'node': true,
    'mocha': true
  },
  'extends': 'eslint:recommended',
  'ignorePatterns': ['examples/**'],
  'rules': {
    'no-console': 0,
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
