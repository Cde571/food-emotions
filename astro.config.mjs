// astro.config.mjs
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
dotenv.config();

export default defineConfig({
  integrations: [tailwind()]
});