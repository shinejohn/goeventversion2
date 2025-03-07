import { Outlet } from 'react-router';

import {
  Page,
  PageLayoutStyle,
  PageMobileNavigation,
  PageNavigation,
} from '@kit/ui/page';
import { SidebarProvider } from '@kit/ui/shadcn-sidebar';

import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { layoutStyleCookie, sidebarStateCookie } from '~/lib/cookies';
import { loadUserWorkspace } from '~/routes/home/user/_lib/load-user-workspace.server';
import type { Route } from '~/types/app/routes/home/user/+types/layout';

// home imports
import { HomeMenuNavigation } from './_components/home-menu-navigation';
import { HomeMobileNavigation } from './_components/home-mobile-navigation';
import { HomeSidebar } from './_components/home-sidebar';

export async function loader(args: Route.LoaderArgs) {
  const workspace = await loadUserWorkspace(args.request);
  const layoutState = await getLayoutState(args.request);

  return {
    workspace,
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
  const layoutStyle = layoutCookie as PageLayoutStyle;

  const sidebarOpenCookieValue = sidebarOpenCookie
    ? sidebarOpenCookie === 'false'
    : !personalAccountNavigationConfig.sidebarCollapsed;

  return {
    open: sidebarOpenCookieValue,
    style: layoutStyle ?? personalAccountNavigationConfig.style,
  };
}
