import React from 'react';
import HubCreatePage from '~/components/magic-patterns/pages/hub/create';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/create';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Check if user is authenticated
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  return {
    userId: user.id
  };
};

export default function CreateHubRoute({ loaderData }: Route.ComponentProps) {
  return <HubCreatePage userId={loaderData.userId} />;
}