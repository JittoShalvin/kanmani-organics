import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // @ts-ignore
    allowedHosts: ['certificates-bandwidth-copy-characterization.trycloudflare.com', '.trycloudflare.com']
  }
})
