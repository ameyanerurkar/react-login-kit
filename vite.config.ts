// @ts-ignore
import { defineConfig } from 'vite';
// @ts-ignore
import react from '@vitejs/plugin-react';
// @ts-ignore
import { resolve } from 'path';

// Use dirname for path resolution
const __dirname = new URL('.', import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactLoginKit',
      fileName: (format) => `react-login-kit.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
}); 