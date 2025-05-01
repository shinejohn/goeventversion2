import type { PlopTypes } from '@turbo/gen';
import { execSync } from 'node:child_process';

import packageJson from '../../../../package.json';

export function createCloudflareGenerator(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator('cloudflare', {
    description: 'Cloudflare generator',
    actions: [
      {
        type: 'add',
        templateFile: 'templates/cloudflare/wrangler.jsonc.hbs',
        path: 'apps/web/wrangler.jsonc',
        data: {
          name: packageJson.name,
        },
      },
      {
        type: 'modify',
        path: 'apps/web/.env.template',
        transform(content) {
          content += '\nLOGGER=console\n';

          return content;
        }
      },
      {
        type: 'add',
        templateFile: '../../apps/web/.env.template',
        path: 'apps/web/.dev.vars',
      },
      {
        type: 'add',
        templateFile: 'templates/cloudflare/entry.server.tsx.hbs',
        path: 'apps/web/app/entry.server.tsx',
        force: true,
      },
      {
        type: 'add',
        templateFile: 'templates/cloudflare/worker-configuration.d.ts.hbs',
        path: 'apps/web/lib/worker-configuration.d.ts',
      },
      {
        type: 'add',
        templateFile: 'templates/cloudflare/worker.ts.hbs',
        path: 'apps/web/worker.ts',
      },
      {
        type: 'modify',
        path: 'apps/web/tsconfig.json',
        transform(content) {
          const tsconfig = JSON.parse(content);

          tsconfig.compilerOptions.types = tsconfig.compilerOptions.types || [];

          tsconfig.compilerOptions.types.push('@cloudflare/workers-types');

          return JSON.stringify(tsconfig, null, 2);
        }
      },
      {
        type: 'modify',
        path: 'apps/web/package.json',
        async transform(content) {
          const pkg = JSON.parse(content);

          const deps = [
            'wrangler',
            '@cloudflare/vite-plugin',
            '@cloudflare/workers-types',
          ];

          const getVersion = async (dep: string) => {
            const res = await fetch(
              `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
            );

            const json = await res.json();
            return json.latest;
          };

          for (const dep of deps) {
            const version = await getVersion(dep);
            pkg.devDependencies![dep] = `^${version}`;
          }

          pkg.scripts = {
            ...pkg.scripts,
            preview: 'npm run build && vite preview',
            deploy: 'npm run build && wrangler deploy',
            'cf-typegen': 'wrangler types',
          };

          return JSON.stringify(pkg, null, 2);
        },
      },
      {
        type: 'modify',
        path: 'apps/web/vite.config.ts',
        async transform(content) {
          content = content.replace(
            'plugins: [',
            'plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }),',
          );

          content = `import { cloudflare } from '@cloudflare/vite-plugin'\n` + content;

          return content;
        },
      },
      {
        type: 'modify',
        path: 'apps/web/react-router.config.ts',
        async transform(content) {
          content = content.replace(
            'ssr: true,',
            'ssr: true,\n' +
            '            future: {\n' +
            '              unstable_viteEnvironmentApi: true,\n' +
            '            },',
          );

          return content;
        },
      },
      async () => {
        /**
         * Install deps and format everything
         */
        execSync('pnpm i', {
          stdio: 'inherit',
        });

        execSync(`pnpm run format:fix`);

        return 'Package scaffolded';
      },
    ],
    prompts: [],
  });
}