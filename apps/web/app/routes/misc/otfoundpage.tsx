import type { Route } from '~/types/app/routes/misc/otfoundpage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { NotFoundPage } from '~/components/magic-patterns/pages/NotFoundPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for NotFoundPage
  return { data: {} };
};

export default function NotFoundPagePage() {
  return <NotFoundPage />;
}