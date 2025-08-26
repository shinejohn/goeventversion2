import { LoaderFunctionArgs, Outlet, useLoaderData } from 'react-router';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// local imports
import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';

export async function loader(args: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(args.request);
  const { data } = await requireUser(supabase);

  return {
    user: data,
  };
}

export default function MarketingLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <SiteHeader user={user} />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
