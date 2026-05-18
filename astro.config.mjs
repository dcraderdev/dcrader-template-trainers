import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dcrader-template-trainers.vercel.app',
  integrations: [sitemap(), tailwind()],
  output: 'static',
});
