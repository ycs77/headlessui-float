import { tailwindcssOriginSafelist } from '@headlessui-float/vue'

/** @type {import('tailwindcss').Config} */
export default {
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
