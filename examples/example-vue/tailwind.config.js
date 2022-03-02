const { tailwindcssPlacementSafelist } = require('headlessui-float-vue')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [...tailwindcssPlacementSafelist],
  theme: {
    extend: {},
  },
  plugins: [],
}
