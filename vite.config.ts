import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Permet le déploiement relatif universel (GitHub Pages, local, serveurs statiques)
  server: {
    host: true, // Écoute sur 0.0.0.0 pour être accessible depuis le téléphone sur le même Wi-Fi
    proxy: {
      '/anki-api': {
        target: 'http://127.0.0.1:8765',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/anki-api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Supprimer l'en-tête Origin pour que AnkiConnect ne bloque pas avec un 403 Forbidden
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
    },
  },
});
