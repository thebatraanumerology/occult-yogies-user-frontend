import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
   server: {
    proxy: {
      '/api': {
        target: 'https://backend.occultyogis.com',
        changeOrigin: true,
        secure: true,
      },
      '/public': {          // 👈 Add this for static files
        target: 'https://backend.occultyogis.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})