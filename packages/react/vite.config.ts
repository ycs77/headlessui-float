import path from 'node:path'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    React(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => format === 'cjs' ? 'headlessui-float.cjs' : 'headlessui-float.mjs',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@headlessui/react',
        '@floating-ui/core',
        '@floating-ui/dom',
        '@floating-ui/react',
      ],
    },
  },
})
