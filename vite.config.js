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
        products: resolve(__dirname, 'products.html'),
        supremo: resolve(__dirname, 'product-supremo.html'),
        ultimo: resolve(__dirname, 'product-ultimo.html'),
        leo: resolve(__dirname, 'product-leo.html'),
        construction: resolve(__dirname, 'product-construction.html'),
        backhoeLoader: resolve(__dirname, 'product-backhoe-loader.html'),
        excavator: resolve(__dirname, 'product-excavator.html'),
        miniExcavator: resolve(__dirname, 'product-mini-excavator.html'),
        smallWheelLoader: resolve(__dirname, 'product-small-wheel-loader.html'),
        tractor: resolve(__dirname, 'product-tractor.html'),
      }
    }
  }
});