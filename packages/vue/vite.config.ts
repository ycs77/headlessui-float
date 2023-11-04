import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => format === 'cjs' ? 'headlessui-float.cjs' : 'headlessui-float.mjs',
    },
    rollupOptions: {
      external: [
        'vue',
        '@headlessui/vue',
        '@floating-ui/core',
        '@floating-ui/dom',
        '@floating-ui/vue',
      ],
    },
  },
})
