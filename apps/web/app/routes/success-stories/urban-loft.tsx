import React from 'react';
import type { Route } from '~/types/app/routes/success-stories/urban-loft';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { UrbanLoftPage } from '~/components/magic-patterns/pages/success-stories/UrbanLoftPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // No data needed for this static story page
  return {};
}

export default function UrbanLoftRoute() {
  return <UrbanLoftPage />;
}