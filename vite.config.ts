import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/english-learning-app/',
  build: {
    target: ['es2020', 'safari14', 'ios14'],
    cssTarget: 'safari14',
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
})
