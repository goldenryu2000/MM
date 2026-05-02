import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Using a relative base path ensures the site works perfectly on GitHub Pages
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        poem: resolve(__dirname, 'poem.html')
      }
    }
  }
});
