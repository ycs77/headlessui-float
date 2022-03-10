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
      fileName: format => `headlessui-float.${format}.js`,
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
