import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import vitePlugin from '@kit/tailwind-config/vite';

export default defineConfig(({ command }) => ({
  ssr: {
    noExternal: command === 'build' ? true : undefined,
  },
  plugins: [reactRouter(), tsconfigPaths(), ...vitePlugin.plugins],
  build: {
    cssMinify: false,
    rollupOptions: {
      external: ['@sentry/remix'],
    },
    dynamicImportVarsOptions: {
      exclude: ['@sentry/remix'],
    },
  },
}));
