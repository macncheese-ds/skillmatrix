import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 5174,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  }
})
