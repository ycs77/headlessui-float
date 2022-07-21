import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    React(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
