import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './', // Explicitly set root to help with workspace detection issues
  server: {
    host: '0.0.0.0',
    port: 8000,
    strictPort: true,
    cors: true,
    hmr: {
      host: '127.0.0.1',
      port: 8000,
      clientPort: 8000,
    },
  },
})
