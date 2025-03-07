import { Outlet, redirect } from 'react-router';

import { getSuperAdminUser } from '@kit/admin';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Page, PageMobileNavigation, PageNavigation } from '@kit/ui/page';

import type { Route } from '~/types/app/routes/admin/+types/layout';

import { AdminSidebar } from './_components/admin-sidebar';
import { AdminMobileNavigation } from './_components/mobile-navigation';

export const meta = () => [
  {
    title: `Super Admin`,
  },
];

export const loader = async function ({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);

  // admin protected route
  const user = await getSuperAdminUser(client);

  if (!user) {
    return redirect('/404');
  }

  return {
    user,
  };
};

export default function AdminLayout() {
  return (
    <Page style={'sidebar'}>
      <PageNavigation>
        <AdminSidebar />
      </PageNavigation>

      <PageMobileNavigation>
        <AdminMobileNavigation />
      </PageMobileNavigation>

      <Outlet />
    </Page>
  );
}
