import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset paths allow the same build to work at github.io/<repository>/.
  base: './',
  plugins: [react()],
})
