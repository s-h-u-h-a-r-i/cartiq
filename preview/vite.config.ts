import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  root: __dirname,
  plugins: [solid()],
  build: {
    outDir: '../dist-preview',
    emptyOutDir: true,
  },
});
