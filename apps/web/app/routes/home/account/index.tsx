import { lazy } from 'react';

import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { ClientOnly } from '@kit/ui/client-only';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route } from '~/types/app/routes/home/account/+types';

import { TeamAccountLayoutPageHeader } from './_components/team-account-layout-page-header';

const DashboardDemo = lazy(
  () => import('../account/_components/dashboard-demo'),
);

export const loader = async (args: Route.LoaderArgs) => {
  const i18n = await createI18nServerInstance(args.request);

  const account = args.params.account as string;
  const title = i18n.t('teams:home.pageTitle');

  return {
    title,
    account,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export default function TeamAccountHomePage(props: Route.ComponentProps) {
  const data = props.loaderData;

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={data.account}
        title={<Trans i18nKey={'common:dashboardTabLabel'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <ClientOnly>
          <DashboardDemo />
        </ClientOnly>
      </PageBody>
    </>
  );
}
