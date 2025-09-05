import type { Config } from '@react-router/dev/config';

//import { vercelPreset } from '@vercel/react-router/vite';

export default {
  // Enable SSR for server routes (API, loaders) but disable pre-rendering
  ssr: true,
  prerender: false,
  presets: [
    // vercelPreset()
  ],
} satisfies Config;
