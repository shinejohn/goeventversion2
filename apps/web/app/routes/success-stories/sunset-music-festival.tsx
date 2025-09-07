import React from 'react';
import type { Route } from '~/types/app/routes/success-stories/sunset-music-festival';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { SunsetMusicFestivalPage } from '~/components/magic-patterns/pages/success-stories/SunsetMusicFestivalPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // No data needed for this static story page
  return {};
}

export default function SunsetMusicFestivalRoute() {
  return <SunsetMusicFestivalPage />;
}