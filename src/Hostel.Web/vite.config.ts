import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/register': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/rest': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/hostel': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/news': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
