import { useRouteLoaderData } from 'react-router';

import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { requireUserLoader } from '~/lib/require-user-loader';
import type { Route } from '~/types/app/routes/home/user/+types';

import { HomeAccountsList } from './_components/home-accounts-list';
import { UserWorkspace } from './_lib/load-user-workspace.server';

export const loader = async ({ request }: Route.LoaderArgs) => {
  await requireUserLoader(request);

  const i18n = await createI18nServerInstance(request);
  const title = i18n.t('account:homePage');

  return {
    title,
  };
};

export default function UserHomePage() {
  const { workspace } = useRouteLoaderData('routes/home/user/layout') as {
    workspace: UserWorkspace;
  };

  const accounts = workspace.accounts;

  return (
    <>
      <PageHeader
        description={<Trans i18nKey={'common:homeTabDescription'} />}
      />

      <PageBody>
        <HomeAccountsList accounts={accounts} />
      </PageBody>
    </>
  );
}
