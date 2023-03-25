import { defineConfig } from 'astro/config';
import astroDefaultPrerender from 'astro-default-prerender';

// https://astro.build/config
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    integrations: [astroDefaultPrerender()],
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
});
