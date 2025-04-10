import { getSuperAdminUser } from '@kit/admin';
import { loadAdminDashboard } from '@kit/admin/api';
import { AdminDashboard } from '@kit/admin/components/admin-dashboard';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody, PageHeader } from '@kit/ui/page';

import type { Route } from '~/types/app/routes/admin/+types';

export const meta = () => [
  {
    title: 'Admin | Dashboard',
  },
];

export const loader = async function (args: Route.LoaderArgs) {
  const client = getSupabaseServerClient(args.request);

  // admin protected route
  await getSuperAdminUser(client);

  return loadAdminDashboard(client);
};

export default function AdminPage(props: Route.ComponentProps) {
  return (
    <>
      <PageHeader description={<AppBreadcrumbs />} />

      <PageBody>
        <AdminDashboard data={props.loaderData} />
      </PageBody>
    </>
  );
}
