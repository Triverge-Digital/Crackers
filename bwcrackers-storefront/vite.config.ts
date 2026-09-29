import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './',
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
} as any)
