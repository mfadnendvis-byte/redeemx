import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/redeemx/',  // 👈 This is required for GitHub Pages
  build: {
    outDir: 'dist',   // Default build output folder
  },
})
