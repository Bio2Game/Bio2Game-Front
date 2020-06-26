module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'vue/no-v-html': 'off',
    curly: [2, 'multi-line'],
    indent: ['warn', 2],
    'vue/attribute-hyphenation': ['error', 'never'],
    'vue/multiline-html-element-content-newline': 'error',
  },
}
