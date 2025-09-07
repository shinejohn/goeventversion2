import React from 'react';
import type { Route } from '~/types/app/routes/venues/list-your-venue';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ListYourVenuePage } from '~/components/magic-patterns/pages/ListYourVenuePage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load venue listing form data
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Handle venue listing submission
  
  return { success: true };
}

export default function ListYourVenueRoute() {
  return <ListYourVenuePage />;
}