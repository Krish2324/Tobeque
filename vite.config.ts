import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%, not dead'))
    }
  },
  build: {
    cssMinify: 'lightningcss'
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

