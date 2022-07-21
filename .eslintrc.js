module.exports = {
  extends: '@ycs77',
  rules: {
    // basic
    'multiline-ternary': 'off',

    // vue
    'vue/no-template-shadow': 'off',
    'vue/one-component-per-file': 'off',

    // typescript
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
  },
}
