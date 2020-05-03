// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/essential'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'import/no-unresolved': 'never',
    'max-len': 'warn',
    // don't require .vue extension when importing
    'import/extensions': 'never',
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'vue/html-indent': 'error'
  },
  globals: {
    App: true,
    Page: true,
    wx: true,
    getApp: true,
    getPage: true,
    requirePlugin: true,
    alert: true,
    uni: true
  }
};
