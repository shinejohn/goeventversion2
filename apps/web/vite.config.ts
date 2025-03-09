import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import vitePlugin from '@kit/tailwind-config/vite';

const ALLOWED_HOSTS =
  process.env.NODE_ENV === 'development' ? ['host.docker.internal'] : [];

export default defineConfig(({ command }) => ({
  ssr: {
    noExternal: command === 'build' ? true : undefined,
  },
  plugins: [reactRouter(), tsconfigPaths(), ...vitePlugin.plugins],
  server: {
    allowedHosts: ALLOWED_HOSTS,
  },
  optimizeDeps: {
    entries: [
      './app/root.tsx',
      './app/entry.server.tsx',
      './app/routes/**/*.tsx',
    ],
  },
}));
