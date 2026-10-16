import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Demo statica: percorsi relativi, cosi' dist/ funziona su qualsiasi host
// (anche in una sottocartella, es. GitHub Pages /DemoEMS/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
