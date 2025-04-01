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
        components: path.resolve(__dirname, './src/components'),
        constants: path.resolve(__dirname, './src/constants'),
        gateway: path.resolve(__dirname, './src/gateway'),
        hooks: path.resolve(__dirname, './src/hooks'),
        images: path.resolve(__dirname, './src/images'),
        pages: path.resolve(__dirname, './src/pages'),
        store: path.resolve(__dirname, './src/store'),
        theme: path.resolve(__dirname, './src/theme'),
        utils: path.resolve(__dirname, './src/utils'),
      },
    },
    plugins: [react()],
  };
});
