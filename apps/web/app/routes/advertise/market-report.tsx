import React from 'react';
import type { Route } from '~/types/app/routes/advertise/market-report';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { MarketReportPage } from '~/components/magic-patterns/pages/performers/MarketReportPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load market report data
  return {};
}

export default function MarketReportRoute() {
  return <MarketReportPage />;
}