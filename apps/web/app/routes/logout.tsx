import React from 'react';
import type { Route } from '~/types/app/routes/logout';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import LogoutPage from '~/components/magic-patterns/pages/logout';
import { redirect } from 'react-router';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // Sign out the user
  await client.auth.signOut();
  
  // Clear any server-side session data
  return {};
}

export default function LogoutRoute() {
  return <LogoutPage />;
}