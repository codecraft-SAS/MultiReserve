import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Asegúrate de que este sea el puerto donde corre tu React
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Tu puerto de Spring Boot
        changeOrigin: true,
        secure: false,
      }
    }
  }
})