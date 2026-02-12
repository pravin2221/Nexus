//

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // App runs at /nexus path
  plugins: [react()],
})
