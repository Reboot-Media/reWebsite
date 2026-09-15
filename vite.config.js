import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        roofers: resolve(__dirname, 'roofers.html'),
        precall: resolve(__dirname, 'roofers/before-your-call/index.html')
      },
      output: {
        manualChunks: undefined
      }
    }
  }
})
