import React from 'react';
import type { Route } from '~/types/app/routes/tickets/selection';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { TicketSelectionPage } from '~/components/magic-patterns/pages/tickets/TicketSelectionPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load available tickets for selection
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Handle ticket selection
  
  return { success: true };
}

export default function TicketSelectionRoute() {
  return <TicketSelectionPage />;
}