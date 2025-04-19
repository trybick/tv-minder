import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
          // eslint-disable-next-line no-undef
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
    plugins: [react()],
  };
});
