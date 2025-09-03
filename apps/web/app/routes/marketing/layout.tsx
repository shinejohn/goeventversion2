import { LoaderFunctionArgs, Outlet, useLoaderData } from 'react-router';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Magic Patterns components
import { MainHeader } from '~/components/magic-patterns/components/layout/MainHeader';
import { Footer } from '~/components/magic-patterns/components/layout/Footer';

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
      <MainHeader />
      <Outlet />
      <Footer />
    </div>
  );
}
