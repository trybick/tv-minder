import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    server: {
      open: true,
      port: 4000,
    },
    build: {
      outDir: 'build',
    },
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        components: path.resolve(import.meta.dirname, './src/components'),
        constants: path.resolve(import.meta.dirname, './src/constants'),
        gateway: path.resolve(import.meta.dirname, './src/gateway'),
        hooks: path.resolve(import.meta.dirname, './src/hooks'),
        images: path.resolve(import.meta.dirname, './src/images'),
        pages: path.resolve(import.meta.dirname, './src/pages'),
        store: path.resolve(import.meta.dirname, './src/store'),
        theme: path.resolve(import.meta.dirname, './src/theme'),
        utils: path.resolve(import.meta.dirname, './src/utils'),
      },
    },
    plugins: [react()],
  };
});
