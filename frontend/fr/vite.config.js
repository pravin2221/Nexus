//

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Marvel_Universe/', // Use your repo name here
  plugins: [react()],
})
