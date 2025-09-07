import React from 'react';
import type { Route } from '~/types/app/routes/book-it/gigs/create';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { GigCreatorPage } from '~/components/magic-patterns/pages/book-it/GigCreatorPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load venues and performer types for dropdowns
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Create gig in database
  // Extract form data and insert into gigs table
  
  return { success: true };
}

export default function GigCreatorRoute() {
  return <GigCreatorPage />;
}