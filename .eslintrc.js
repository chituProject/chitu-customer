// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    "parser": "babel-eslint",
    "sourceType": 'module',
    "ecmaVersion": 2017
  },
  env: {
    browser: false,
    node: true,
    es6: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    "plugin:vue/recommended",
    'plugin:prettier/recommended',
    // 关掉和prettier冲突的规则，这两个必须放在最后
    'prettier',
    "prettier/vue"
  ],
  // add your custom rules here
  'rules': {
    // uni-app import resolving does not rely on explicit webpack config
    'import/no-unresolved': 'never',
    'import/extensions': 'never',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow console during development
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    // don't require prop types
    'vue/require-prop-types': 'off',
    // camelcase已经放弃了
    'camelcase': 0,
    'no-param-reassign': 0,
    'no-shadow': 1,
    'no-underscore-dangle': 'warn',
    // '_'开头的变量可视为没有用到的
    "no-unused-vars": ["error", {"argsIgnorePattern": "^_", "ignoreRestSiblings": true}],
    "prettier/prettier": "error",
    "prefer-destructuring": "warn",
    "import/prefer-default-export": "warn"
  },
  globals: {
    App: true,
    Page: true,
    wx: true,
    uni: true,
    getApp: true,
    getPage: true,
    requirePlugin: true,
    alert: true,
    getCurrentPages: true
  }
};
