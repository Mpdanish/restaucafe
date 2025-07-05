// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: './', // This ensures paths are relative to the index.html file
  build: {
    outDir: 'dist', // Output directory for the build
    assetsDir: 'assets', // Assets will be placed inside 'dist/assets'
  },
});
