//

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/nexus/', // App runs at /nexus path
  plugins: [react()],
})
