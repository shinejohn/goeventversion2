import React from 'react';
import type { Route } from '~/types/app/routes/social/groups';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { GroupsPage } from '~/components/magic-patterns/pages/social/GroupsPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load user's groups data
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Handle group creation, join/leave actions
  
  return { success: true };
}

export default function GroupsRoute() {
  return <GroupsPage />;
}