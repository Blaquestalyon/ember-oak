import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // Origin checking guards write endpoints; this app has none — every non-GET
  // is rejected with 405 by the middleware, so the 403 origin check would mask it.
  security: { checkOrigin: false },
  server: {
    host: '0.0.0.0',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // CSP is script-src 'self' with no unsafe-inline: every script must be
      // an external same-origin file, so never inline small bundles.
      assetsInlineLimit: 0,
    },
  },
});
