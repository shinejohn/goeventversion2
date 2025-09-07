import React from 'react';
import type { Route } from '~/types/app/routes/success-stories/jazz-quartet';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { JazzQuartetPage } from '~/components/magic-patterns/pages/success-stories/JazzQuartetPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // No data needed for this static story page
  return {};
}

export default function JazzQuartetRoute() {
  return <JazzQuartetPage />;
}