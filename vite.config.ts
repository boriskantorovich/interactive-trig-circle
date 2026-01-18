import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Repository name: interactive-trig-circle
  // Leave as '/' for root domain or custom domain
  base: process.env.GITHUB_PAGES === 'true' ? '/interactive-trig-circle/' : '/',
})
