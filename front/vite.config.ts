import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: { open: true, port: 4000 },
  build: { outDir: 'build' },
  resolve: {
    alias: { '~': path.resolve(__dirname, 'src') },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: false,
      workbox: {
        disableDevLogs: true,
        globPatterns: [],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/3\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-api-cache',
              // plugins: [
              //   {
              //     cacheKeyWillBeUsed: async ({ request }) => {
              //       return request.url;
              //     },
              //   },
              // ],
              matchOptions: {
                ignoreVary: true,
              },
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 5,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
