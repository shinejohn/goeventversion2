import type { PlopTypes } from '@turbo/gen';
import { execSync } from 'node:child_process';
import * as os from 'node:os';

import { getPackageVersion } from '../../utils';

export function createDockerGenerator(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator('docker', {
    description: 'Dockerfile generator',
    actions: [
      {
        type: 'modify',
        path: 'apps/web/package.json',
        async transform(content) {
          const pkg = JSON.parse(content);
          const deps = getDevDeps();

          for (const dep of deps) {
            const version = await getPackageVersion(dep);
            pkg['devDependencies'][dep] = `^${version}`;
          }

          return JSON.stringify(pkg, null, 2);
        },
      },
      {
        type: 'add',
        templateFile: 'templates/docker/Dockerfile.hbs',
        path: 'Dockerfile',
      },
      async () => {
        execSync('pnpm i', {
          stdio: 'inherit',
        });

        execSync('pnpm format:fix', {
          stdio: 'inherit',
        });

        return 'Dockerfile generated';
      },
    ],
    prompts: [],
  });
}

function getDevDeps() {
  const arch = os.arch();

  if (arch === 'arm64') {
    return [
      'lightningcss-linux-arm64-musl',
      '@tailwindcss/oxide-linux-arm64-musl',
      '@rollup/rollup-linux-arm64-musl',
      '@esbuild/darwin-arm64',
    ];
  } else if (arch === 'x64') {
    const isMusl = process.config?.variables?.hasOwnProperty('musl');

    return isMusl
      ? [
          'lightningcss-linux-x64-musl',
          '@tailwindcss/oxide-linux-x64-musl',
          '@rollup/rollup-linux-x64-musl',
          '@esbuild/linux-x64',
        ]
      : [
          'lightningcss-linux-x64-gnu',
          '@tailwindcss/oxide-linux-x64-gnu',
          '@rollup/rollup-linux-x64-gnu',
          '@esbuild/linux-x64',
        ];
  } else {
    return [];
  }
}
