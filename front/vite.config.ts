import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { open: true, port: 4000 },
  build: { outDir: 'build' },
  resolve: {
    alias: { '~': path.resolve(__dirname, 'src') },
  },
  plugins: [react()],
});
