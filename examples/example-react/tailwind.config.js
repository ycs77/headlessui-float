const { tailwindcssOriginSafelist } = require('headlessui-float-react')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [...tailwindcssOriginSafelist],
  theme: {
    extend: {},
  },
  plugins: [],
}
