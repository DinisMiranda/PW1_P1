import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    // Desativa vue-devtools apenas em modo de teste
    ...(process.env.NODE_ENV === 'test' ? [] : [vueDevTools()]),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~imagens': fileURLToPath(new URL('./imagens', import.meta.url)),
      fs: fileURLToPath(new URL('./src/shims/fs.js', import.meta.url)),
      path: fileURLToPath(new URL('./src/shims/path.js', import.meta.url)),
      'form-data': fileURLToPath(new URL('./src/shims/form-data.js', import.meta.url))
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
})
