import type { Config } from 'tailwindcss'
import { tailwindcssOriginSafelist } from '@headlessui-float/react'

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
} satisfies Config
