// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Fully static site: every page is built ahead of time as plain HTML.
  // Cloudflare Pages serves those files directly, so no server adapter is needed.
  output: 'static',
  // Placeholder production URL — update once the real domain is known.
  site: 'https://good-bricks.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
