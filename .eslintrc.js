module.exports =
{
  env:
  {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends:
  [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:flowtype/recommended',
  ],
  parserOptions:
  {
    ecmaFeatures:
    {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins:
  [
    'react',
    'jest',
    'flowtype',
  ],
  rules:
  {
    indent:
    [
      'error',
      2,
      {SwitchCase: 1}
    ],
    'linebreak-style':
    [
      'error',
      'unix'
    ],
    semi:
    [
      'error',
      'always'
    ],
    quotes:
    [
      'error',
      'single',
      {avoidEscape: true},
    ],
    'no-unused-vars':
    [
      'error',
      {
        varsIgnorePattern: '\\b_\\b',
        argsIgnorePattern: '\\b_\\b'
      },
    ],
    'react/jsx-uses-vars': 2,
    'flowtype/space-before-type-colon': 'off',
  }
};
