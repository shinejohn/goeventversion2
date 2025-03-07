import { Outlet } from 'react-router';

import { If } from '@kit/ui/if';
import {
  Page,
  PageLayoutStyle,
  PageMobileNavigation,
  PageNavigation,
} from '@kit/ui/page';

import { AppLogo } from '~/components/app-logo';
import pathsConfig from '~/config/paths.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { layoutStyleCookie } from '~/lib/cookies';
import { loadUserWorkspace } from '~/routes/home/user/_lib/load-user-workspace.server';
import type { Route } from '~/types/app/routes/home/user/+types/layout';

// home imports
import { HomeMenuNavigation } from './_components/home-menu-navigation';
import { HomeMobileNavigation } from './_components/home-mobile-navigation';
import { HomeSidebar } from './_components/home-sidebar';

export async function loader(args: Route.LoaderArgs) {
  const workspace = await loadUserWorkspace(args.request);
  const style = await getLayoutStyle(args.request);

  return {
    workspace,
    style,
  };
}

export default function UserHomeLayout({ loaderData }: Route.ComponentProps) {
  const { workspace, style } = loaderData;

  return (
    <Page style={style}>
      <PageNavigation>
        <If condition={style === 'header'}>
          <HomeMenuNavigation workspace={workspace} />
        </If>

        <If condition={style === 'sidebar'}>
          <HomeSidebar workspace={workspace} />
        </If>
      </PageNavigation>

      <PageMobileNavigation className={'flex items-center justify-between'}>
        <AppLogo href={pathsConfig.app.home} />

        <HomeMobileNavigation workspace={workspace} />
      </PageMobileNavigation>

      <Outlet />
    </Page>
  );
}

async function getLayoutStyle(request: Request) {
  const value = await layoutStyleCookie.parse(
    request.headers.get('cookie') ?? '',
  );

  if (typeof value === 'string') {
    return value as PageLayoutStyle;
  }

  return personalAccountNavigationConfig.style;
}
