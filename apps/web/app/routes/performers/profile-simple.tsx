import React from 'react';
import type { Route } from '~/types/app/routes/performers/profile-simple';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PerformerProfilePageSimple } from '~/components/magic-patterns/pages/performers/PerformerProfilePageSimple';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load performer profile data
  return {};
}

export default function PerformerProfileSimpleRoute() {
  return <PerformerProfilePageSimple />;
}