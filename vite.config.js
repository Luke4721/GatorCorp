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
      ]
    }
  }
});
