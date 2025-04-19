import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      alias: [
        {
          find: '~',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
    plugins: [react()],
  };
});
