import path from 'path'
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
      fileName: format => {
        if (format === 'cjs') {
          return 'headlessui-float.cjs'
        }
        return 'headlessui-float.js'
      },
    },
    rollupOptions: {
      external: [
        'vue',
        '@floating-ui/core',
        '@floating-ui/dom',
      ],
    },
  },
})
