import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    exclude: ['lucide-react', 'pg', 'bcrypt'],
    include: ['react-is', 'recharts']
  },
  resolve: {
    alias: {
      'react-is': 'react-is'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  ssr: {
    noExternal: []
  },
  build: {
    rollupOptions: {
      external: []
    }
  }
});
