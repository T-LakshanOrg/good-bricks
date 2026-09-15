// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Fully static site: every page is built ahead of time as plain HTML.
  // A Cloudflare Worker serves those files directly, so no server adapter is needed.
  output: 'static',
  // Live production URL. Update again if a custom domain is added later.
  site: 'https://good-bricks.itsthusharahere.workers.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
