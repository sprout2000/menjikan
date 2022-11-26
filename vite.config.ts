import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  root: './src',
  publicDir: '../public',
  server: { open: true },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: '麺時間PWA',
        short_name: '麺時間',
        description: 'シンプルなラーメンタイマー',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#4a148c',
        background_color: '#4a148c',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512x512-mask.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
