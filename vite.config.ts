import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  root: './src',
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        short_name: '麺時間',
        name: '麺時間 PWA',
        categories: ['utilities'],
        icons: [
          {
            src: 'images/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'images/icon-512-mask.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#4a148c',
        background_color: '#4a148c',
        screenshots: [
          {
            src: 'images/screenshot-746-551.png',
            sizes: '746x551',
            type: 'image/png',
          },
        ],
        shortcuts: [
          {
            name: '麺時間を開く',
            short_name: '麺時間',
            description: 'シンプルなラーメンタイマー',
            url: '.',
            icons: ['images/icon-192.png', 'images/icon-512.png'],
          },
        ],
      },
    }),
  ],
});
