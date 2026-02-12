//

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Reverse proxy handles the /nexus prefix
  plugins: [react()],
})
