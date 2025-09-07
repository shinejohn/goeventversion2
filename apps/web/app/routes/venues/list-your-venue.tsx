import React from 'react';
import type { Route } from './+types/list-your-venue';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ListYourVenuePage } from '../../components/magic-patterns/pages/ListYourVenuePage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  const { data: { user } } = await client.auth.getUser();
  
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  const { data: existingVenues } = await client
    .from('venues')
    .select('id, name, address, city')
    .eq('account_id', user.id)
    .order('created_at', { ascending: false });
  
  return {
    user,
    existingVenues: existingVenues || []
  };
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  const { data: { user } } = await client.auth.getUser();
  
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  const venueData = {
    name: formData.get('name') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    venue_type: formData.get('venue_type') as string || 'other',
    capacity: parseInt(formData.get('capacity') as string) || null,
    account_id: user.id,
    is_active: true,
    created_by: user.id
  };
  
  const { data, error } = await client
    .from('venues')
    .insert(venueData)
    .select()
    .single();
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, venueId: data.id };
}

export default function ListYourVenueRoute() {
  return <ListYourVenuePage />;
}