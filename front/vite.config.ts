import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: { open: true, port: 4000 },
  build: {
    outDir: 'build',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules\/(react|react-dom)\//,
            },
            {
              name: 'vendor-chakra',
              test: /node_modules\/(@chakra-ui\/react|@emotion\/react|next-themes)\//,
            },
            {
              name: 'vendor-fullcalendar',
              test: /node_modules\/@fullcalendar\//,
            },
            {
              name: 'vendor-sentry',
              test: /node_modules\/@sentry\//,
            },
            {
              name: 'vendor-redux',
              test: /node_modules\/(@reduxjs\/toolkit|react-redux|redux-persist)\//,
            },
            {
              name: 'vendor-table',
              test: /node_modules\/@tanstack\/react-table\//,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: { '~': path.resolve(import.meta.dirname, 'src') },
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
