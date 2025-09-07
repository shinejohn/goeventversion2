import React from 'react';
import { Outlet } from 'react-router';

import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import {
  Page,
  PageLayoutStyle,
  PageMobileNavigation,
  PageNavigation,
} from '@kit/ui/page';
import { SidebarProvider } from '@kit/ui/shadcn-sidebar';

import { AppLogo } from '../../../../components/app-logo';
import { getTeamAccountSidebarConfig } from '~/config/team-account-navigation.config';
import { layoutStyleCookie, sidebarStateCookie } from '~/lib/cookies';
import type { Route } from './+types/account/layout';

import { TeamAccountLayoutMobileNavigation } from './_components/team-account-layout-mobile-navigation';
import { TeamAccountLayoutSidebar } from './_components/team-account-layout-sidebar';
import { TeamAccountNavigationMenu } from './_components/team-account-navigation-menu';
import { loadTeamWorkspace } from './_lib/team-account-workspace-loader.server';

export const loader = async (args: Route.LoaderArgs) => {
  const accountSlug = args.params.account as string;

  const client = getSupabaseServerClient(args.request);
  const layoutState = await getLayoutState(args.request, accountSlug);

  const workspace = await loadTeamWorkspace({
    accountSlug,
    client,
  });

  return {
    workspace,
    layoutState,
    accountSlug,
  };
};

export default function TeamWorkspaceLayout(props: Route.ComponentProps) {
  const { layoutState } = props.loaderData;

  if (layoutState.style === 'sidebar') {
    return (
      <SidebarLayout {...props}>
        <Outlet />
      </SidebarLayout>
    );
  }

  return <HeaderLayout {...props}>{<Outlet />}</HeaderLayout>;
}

function SidebarLayout(props: React.PropsWithChildren<Route.ComponentProps>) {
  const { workspace, layoutState, accountSlug } = props.loaderData;

  const accounts = workspace.accounts.map(({ name, slug, picture_url }) => ({
    label: name,
    value: slug,
    image: picture_url,
  }));

  const account = workspace.account;
  const user = workspace.user;

  return (
    <SidebarProvider defaultOpen={layoutState.open}>
      <Page style={'sidebar'}>
        <PageNavigation>
          <TeamAccountLayoutSidebar
            account={accountSlug}
            accountId={account.id}
            accounts={accounts}
            user={user}
          />
        </PageNavigation>

        <PageMobileNavigation className={'flex items-center justify-between'}>
          <AppLogo />

          <div className={'flex space-x-4'}>
            <TeamAccountLayoutMobileNavigation
              userId={user.id}
              accounts={accounts}
              account={accountSlug}
            />
          </div>
        </PageMobileNavigation>

        {props.children}
      </Page>
    </SidebarProvider>
  );
}

function HeaderLayout(props: React.PropsWithChildren<Route.ComponentProps>) {
  const { workspace, accountSlug } = props.loaderData;

  const accounts = workspace.accounts.map(({ name, slug, picture_url }) => ({
    label: name,
    value: slug,
    image: picture_url,
  }));

  return (
    <Page style={'header'}>
      <PageNavigation>
        <TeamAccountNavigationMenu workspace={workspace} />
      </PageNavigation>

      <PageMobileNavigation className={'flex items-center justify-between'}>
        <AppLogo />

        <div className={'group-data-[mobile:hidden]'}>
          <TeamAccountLayoutMobileNavigation
            userId={workspace.user.id}
            accounts={accounts}
            account={accountSlug}
          />
        </div>
      </PageMobileNavigation>

      {props.children}
    </Page>
  );
}

async function getLayoutState(request: Request, account: string) {
  const cookieHeader = request.headers.get('cookie');
  const sidebarOpenCookie = await sidebarStateCookie.parse(cookieHeader);
  const layoutCookie = await layoutStyleCookie.parse(cookieHeader);
  const layoutStyle = layoutCookie as PageLayoutStyle;
  const config = getTeamAccountSidebarConfig(account);

  const sidebarOpenCookieValue = sidebarOpenCookie
    ? sidebarOpenCookie === 'false'
    : !config.sidebarCollapsed;

  const parsed = z.enum(['header', 'sidebar', 'custom']).safeParse(layoutStyle);

  const style = parsed.success ? parsed.data : config.style;

  return {
    open: sidebarOpenCookieValue,
    style,
  };
}
