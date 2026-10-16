import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Demo statica: percorsi relativi, cosi' la build funziona su qualsiasi host
// (anche in una sottocartella, es. GitHub Pages /DemoEMS/).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'docs' }, // GitHub Pages pubblica da main:/docs
})
