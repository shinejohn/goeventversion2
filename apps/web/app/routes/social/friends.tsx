import React from 'react';
import type { Route } from '~/types/app/routes/social/friends';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { FriendsPage } from '~/components/magic-patterns/pages/social/FriendsPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load user's friends data
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Handle friend requests, accept/decline actions
  
  return { success: true };
}

export default function FriendsRoute() {
  return <FriendsPage />;
}