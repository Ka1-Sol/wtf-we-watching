import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // carica le variabili di ambiente
  loadEnv(mode, process.cwd(), '');
  
  // Imposta env.ROLLUP_SKIP_LOAD_NATIVE_PLUGIN a 1 per evitare problemi con Rollup
  process.env.ROLLUP_SKIP_LOAD_NATIVE_PLUGIN = "1";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: process.env.NODE_ENV === 'development',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        external: [],
        treeshake: true,
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-components': ['@headlessui/react', 'framer-motion'],
            'state-management': ['@reduxjs/toolkit', 'react-redux']
          }
        }
      }
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-router-dom',
        '@headlessui/react',
        'framer-motion',
        '@reduxjs/toolkit',
        'react-redux'
      ]
    }
  }
})
