import ycs77, { GLOB_JSX, GLOB_TS, GLOB_TSX, GLOB_VUE } from '@ycs77/eslint-config'

export default ycs77(
  {
    vue: true,
    typescript: true,
  },
  {
    rules: {
      'test/prefer-lowercase-title': 'off',
    },
  },
  {
    files: [GLOB_TS, GLOB_TSX],
    rules: {
      'ts/prefer-literal-enum-member': 'off',

      'node/prefer-global/process': 'off',

      'antfu/top-level-function': 'off',
      'antfu/consistent-list-newline': 'off',
    },
  },
  {
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
    },
  },
  {
    files: [GLOB_VUE],
    rules: {
      'vue/no-template-shadow': 'off',
    },
  },
  {
    files: [
      'packages/react/src/utils/*.ts',
      'packages/vue/src/utils/*.ts',
    ],
    rules: {
      'style/comma-dangle': 'off',
    },
  },
)
