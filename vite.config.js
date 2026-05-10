import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import path from "path";

export default defineConfig({
  base: '/Traveloop/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    transformer: 'postcss',
    minify: 'esbuild',
  },
  build: {
    cssMinify: 'esbuild',
  },
})
