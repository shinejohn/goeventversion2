import type { Route } from '~/types/app/routes/misc/omepageshowcasepage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { HomepageShowcasePage } from '~/components/magic-patterns/pages/advertise/HomepageShowcasePage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for HomepageShowcasePage
  return { data: {} };
};

export default function HomepageShowcasePagePage() {
  return <HomepageShowcasePage />;
}