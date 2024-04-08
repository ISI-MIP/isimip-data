module.exports = {
  'root': true,
  'globals': {
    '$': true
  },
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'ignorePatterns': ['**/static/**/*.js'],
  'rules': {
    'indent': 'off',
    'no-empty-pattern': 'off',
    'linebreak-style': [
      'error',
      'unix'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
}
