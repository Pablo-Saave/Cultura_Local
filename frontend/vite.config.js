import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Cultura_Local/',   // 👈 Ajuste para GitHub Pages

  plugins: [react()],

  server: {
    port: 5173,
    open: true
  }
})

