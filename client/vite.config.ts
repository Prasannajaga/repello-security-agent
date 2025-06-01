import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const port = env.VITE_PORT ? Number(env.VITE_PORT) : 5173

  return {
    plugins: [react()],
    server: {
      port,
    },
  }
})
