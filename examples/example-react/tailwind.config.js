module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    'origin-bottom',
    'origin-top',
    'origin-right',
    'origin-left',
    'origin-bottom-left',
    'origin-bottom-right',
    'origin-top-left',
    'origin-top-right',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
