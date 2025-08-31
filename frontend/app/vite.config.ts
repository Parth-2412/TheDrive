d f/// <reference types="vitest" />
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),

  ],
  resolve: {
    alias: {
      '@cubone/react-file-manager': path.resolve(__dirname, '../react-file-manager/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
