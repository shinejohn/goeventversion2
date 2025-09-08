import { z } from 'zod';

import { KeystaticStorage } from './keystatic-storage';
import { keyStaticConfig } from './keystatic.config';

/**
 * Create a KeyStatic reader based on the storage kind.
 * This function should only be called on the server side.
 */
export async function createKeystaticReader() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error(
      'Keystatic reader cannot be used in browser environment. ' +
      'Please ensure this is only called from server-side code (loaders, actions, API routes).'
    );
  }

  switch (KeystaticStorage.kind) {
    case 'local': {
      // Only import Node.js modules when we're sure we're on the server
      const process = await import('node:process').then(m => m.default);
      const { createReader } = await import('@keystatic/core/reader').catch();

      return createReader(process.cwd(), keyStaticConfig);
    }

    case 'github':
    case 'cloud': {
      const { createGitHubReader } = await import(
        '@keystatic/core/reader/github'
      ).catch();

      return createGitHubReader(
        keyStaticConfig,
        await getKeystaticGithubConfiguration(),
      );
    }

    default:
      throw new Error(`Unknown storage kind`);
  }
}

async function getKeystaticGithubConfiguration() {
  // We're already guaranteed to be server-side when this runs
  const process = await import('node:process').then(m => m.default);
  
  const repo =
    import.meta.env.VITE_KEYSTATIC_STORAGE_REPO ??
    process.env.KEYSTATIC_STORAGE_REPO;
  const token = process.env.KEYSTATIC_GITHUB_TOKEN;
  const pathPrefix = process.env.KEYSTATIC_PATH_PREFIX;

  return z
    .object({
      token: z.string({
        description:
          'The GitHub token to use for authentication. Please provide the value through the "KEYSTATIC_GITHUB_TOKEN" environment variable.',
      }),
      repo: z.custom<`${string}/${string}`>(),
      pathPrefix: z.string().optional(),
    })
    .parse({
      token,
      repo,
      pathPrefix,
    });
}
