import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    Vue(),
    Icons(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
