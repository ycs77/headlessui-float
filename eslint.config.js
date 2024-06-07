import ycs77, { GLOB_JSX, GLOB_TS, GLOB_TSX } from '@ycs77/eslint-config'

export default ycs77({
  vue: true,
  typescript: true,
})
  .append({
    rules: {
      'test/prefer-lowercase-title': 'off',
    },
  })
  .append({
    files: [GLOB_TS, GLOB_TSX],
    rules: {
      'ts/prefer-literal-enum-member': 'off',

      'antfu/top-level-function': 'off',
      'antfu/consistent-list-newline': 'off',
    },
  })
  .append({
    files: [GLOB_JSX, GLOB_TSX],
    rules: {
      'antfu/top-level-function': 'off',
      'antfu/consistent-list-newline': 'off',

      'style/jsx-closing-bracket-location': 'off',
      'style/jsx-curly-newline': 'off',
      'style/jsx-first-prop-new-line': 'off',
      'style/jsx-indent': 'off',
      'style/jsx-max-props-per-line': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/quote-props': 'off',
    },
  })
  .append({
    files: ['packages/*/src/utils/*.ts'],
    rules: {
      'style/comma-dangle': 'off',
      'ts/comma-dangle': 'off',
    },
  })
