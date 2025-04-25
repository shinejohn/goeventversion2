import { Outlet } from 'react-router';

import { z } from 'zod';

import { Page, PageMobileNavigation, PageNavigation } from '@kit/ui/page';
import { SidebarProvider } from '@kit/ui/shadcn-sidebar';

import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { layoutStyleCookie, sidebarStateCookie } from '~/lib/cookies';
import { requireUserLoader } from '~/lib/require-user-loader';
import { loadUserWorkspace } from '~/routes/home/user/_lib/load-user-workspace.server';
import type { Route } from '~/types/app/routes/home/user/+types/layout';

// home imports
import { HomeMenuNavigation } from './_components/home-menu-navigation';
import { HomeMobileNavigation } from './_components/home-mobile-navigation';
import { HomeSidebar } from './_components/home-sidebar';

export async function loader(args: Route.LoaderArgs) {
  const request = args.request;
  const user = await requireUserLoader(request);

  const [workspace, layoutState] = await Promise.all([
    loadUserWorkspace(request),
    getLayoutState(request),
  ]);

  return {
    workspace: {
      ...workspace,
      user,
    },
    layoutState,
  };
}

function SidebarLayout(props: Route.ComponentProps & React.PropsWithChildren) {
  const { workspace, layoutState } = props.loaderData;

  return (
    <SidebarProvider defaultOpen={layoutState.open}>
      <Page style={'sidebar'}>
        <PageNavigation>
          <HomeSidebar workspace={workspace} />
        </PageNavigation>

        <PageMobileNavigation className={'flex items-center justify-between'}>
          <HomeMobileNavigation workspace={workspace} />
        </PageMobileNavigation>

        {props.children}
      </Page>
    </SidebarProvider>
  );
}

function HeaderLayout(props: Route.ComponentProps & React.PropsWithChildren) {
  const { workspace } = props.loaderData;

  return (
    <Page style={'header'}>
      <PageNavigation>
        <HomeMenuNavigation workspace={workspace} />
      </PageNavigation>

      <PageMobileNavigation className={'flex items-center justify-between'}>
        <HomeMobileNavigation workspace={workspace} />
      </PageMobileNavigation>

      {props.children}
    </Page>
  );
}

export default function UserHomeLayout(props: Route.ComponentProps) {
  const { layoutState } = props.loaderData;

  if (layoutState.style === 'sidebar') {
    return <SidebarLayout {...props}>{<Outlet />}</SidebarLayout>;
  }

  return <HeaderLayout {...props}>{<Outlet />}</HeaderLayout>;
}

async function getLayoutState(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const sidebarOpenCookie = await sidebarStateCookie.parse(cookieHeader);
  const layoutCookie = await layoutStyleCookie.parse(cookieHeader);

  const layoutStyle = z
    .enum(['header', 'sidebar', 'custom'])
    .safeParse(layoutCookie);

  const sidebarOpenCookieValue = sidebarOpenCookie
    ? sidebarOpenCookie === 'false'
    : !personalAccountNavigationConfig.sidebarCollapsed;

  return {
    open: sidebarOpenCookieValue,
    style: layoutStyle.success
      ? layoutStyle.data
      : personalAccountNavigationConfig.style,
  };
}
