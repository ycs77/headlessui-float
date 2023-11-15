import type { Config } from 'tailwindcss'
import { tailwindcssOriginSafelist } from '@headlessui-float/vue'

export default {
  safelist: [...tailwindcssOriginSafelist],
  theme: {
    extend: {},
  },
} satisfies Partial<Config>
