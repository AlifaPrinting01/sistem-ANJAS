
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Memastikan process.env tersedia di sisi client
    'process.env': process.env
  },
  build: {
    // Meningkatkan limit peringatan ukuran chunk menjadi 1000kb
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Memecah vendor (library) menjadi file terpisah untuk performa lebih baik
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('@google/genai')) return 'ai-engine';
            return 'vendor';
          }
        },
      },
    },
  },
});
