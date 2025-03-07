import { Outlet } from 'react-router';

import type { User } from '@supabase/supabase-js';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import type { Route } from '~/types/app/routes/marketing/+types/layout';

// local imports
import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  return {
    user,
  };
}

export default function MarketingLayout(props: Route.ComponentProps) {
  const { loaderData } = props;

  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <SiteHeader user={loaderData.user as User} />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
