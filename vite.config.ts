import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 5410,
    proxy: {
      '/api': {
        target: 'http://localhost:5411',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5411',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5411',
        changeOrigin: true,
        secure: false,
      },
      '/photo': {
        target: 'http://localhost:5411',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
