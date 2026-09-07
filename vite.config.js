import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['venv']
  },
  server: {
    watch: {
      ignored: ['**/venv/**']
    }
  },
  build: {
    rollupOptions: {
      external: [
        /venv\/.*/
      ],
      input: {
        main: resolve(__dirname, 'index.html'),
        supremo: resolve(__dirname, 'product-supremo.html'),
        ultimo: resolve(__dirname, 'product-ultimo.html'),
        leo: resolve(__dirname, 'product-leo.html'),
        duro: resolve(__dirname, 'product-duro.html'),
        boss: resolve(__dirname, 'product-boss.html'),
        ergo: resolve(__dirname, 'product-ergo.html'),
        technology: resolve(__dirname, 'technology.html'),
        sustainability: resolve(__dirname, 'sustainability.html'),
        careers: resolve(__dirname, 'careers.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});