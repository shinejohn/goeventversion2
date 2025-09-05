import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import tailwindCssVitePlugin from '@kit/tailwind-config/vite';

const ALLOWED_HOSTS =
  process.env.NODE_ENV === 'development' ? ['host.docker.internal'] : [];

export default defineConfig(({ command }) => ({
  ssr: {
    noExternal: command === 'build' ? true : undefined,
  },
  plugins: [reactRouter(), tsconfigPaths(), ...tailwindCssVitePlugin.plugins],
  server: {
    allowedHosts: ALLOWED_HOSTS,
  },
  build: {
    sourcemap: false, // Disable sourcemaps in production to avoid build errors
    minify: command === 'build' ? 'esbuild' : false,
    rollupOptions: {
      external: ['fsevents'],
      // Disable sourcemap warnings
      onwarn: (warning, warn) => {
        if (warning.code === 'SOURCEMAP_ERROR') return;
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],
    entries: [
      './app/root.tsx',
      './app/entry.server.tsx',
      './app/routes/**/*.tsx',
    ],
  },
  // Suppress sourcemap warnings entirely
  logLevel: command === 'build' ? 'warn' : 'info',
}));
