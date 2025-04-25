import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
} from 'react-router';

import { CsrfTokenMeta } from '@kit/csrf/client';
import { createCsrfProtect } from '@kit/csrf/server';
import { cn } from '@kit/ui/utils';

import { RootErrorBoundary } from '~/components/root-error-boundary';
import { RootHead } from '~/components/root-head';
import { RootProviders } from '~/components/root-providers';
import appConfig from '~/config/app.config';
import { themeCookie } from '~/lib/cookies';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route } from '~/types/app/+types/root';

import styles from '../styles/global.css?url';
import { z } from 'zod';

// error boundary
export const ErrorBoundary = RootErrorBoundary;

const csrfProtect = createCsrfProtect();

export const links = () => [{ rel: 'stylesheet', href: styles }];

export const meta = () => {
  return [
    {
      title: appConfig.title,
    },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const { language } = await createI18nServerInstance(request);
  const theme = await getTheme(request);
  const className = getClassName(theme);
  const csrfToken = await csrfProtect(request);

  return data(
    {
      language,
      className,
      theme,
      csrfToken,
    },
    {
      headers: request.headers,
    },
  );
}

export default function App(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { language, className, theme } = loaderData ?? {};

  return (
    <html lang={language} className={className}>
      <head>
        <RootHead />
        <Meta />
        <Links />
        <CsrfTokenMeta csrf={loaderData.csrfToken} />
      </head>

      <body>
        <RootProviders theme={theme} language={language}>
          <Outlet />
        </RootProviders>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  return cn('bg-background min-h-screen antialiased', {
    dark,
    light,
  });
}

async function getTheme(request: Request) {
  const cookie = request.headers.get('Cookie');
  const theme = await themeCookie.parse(cookie);

  if (Object.keys(theme ?? {}).length === 0) {
    return appConfig.theme;
  }

  const parsed = z.enum(['light', 'dark', 'system']).safeParse(theme);

  if (parsed.success) {
    return parsed.data;
  }

  return appConfig.theme;
}
