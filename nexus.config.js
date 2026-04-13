import { defineConfig } from 'vite'

export default defineConfig({
  react: {
    jsxImportSource: 'react',
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
