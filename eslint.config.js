import ycs77, { GLOB_JSX, GLOB_TS, GLOB_TSX, GLOB_VUE } from '@ycs77/eslint-config'

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
    files: [GLOB_TS, GLOB_TSX, GLOB_VUE],
    rules: {
      'style/indent': 'off',

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

      'style/indent': 'off',
      'style/jsx-closing-bracket-location': 'off',
      'style/jsx-curly-newline': 'off',
      'style/jsx-first-prop-new-line': 'off',
      'style/jsx-indent': 'off',
      'style/jsx-max-props-per-line': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/quote-props': 'off',

      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'off',
    },
  })
  .append({
    files: ['packages/*/src/utils/*.ts'],
    rules: {
      'style/comma-dangle': 'off',
      'ts/comma-dangle': 'off',
      'ts/no-unsafe-function-type': 'off',
    },
  })
