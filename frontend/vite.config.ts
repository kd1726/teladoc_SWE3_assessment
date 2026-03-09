import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(),
  tailwindcss()
  ],
  server: {
    port: 3000
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})


