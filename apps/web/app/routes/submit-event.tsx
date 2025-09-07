import React from 'react';
import { SubmitEventPage } from '~/components/magic-patterns/pages/SubmitEventPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/submit-event';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Check authentication
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  // Load venues and categories for the form
  const [venuesResult, categoriesResult] = await Promise.all([
    client.from('venues').select('id, name').eq('is_active', true).order('name'),
    client.from('event_categories').select('id, name, slug').order('name')
  ]);
  
  return {
    venues: venuesResult.data || [],
    categories: categoriesResult.data || [],
    userId: user.id
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Process event submission
  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    venue_id: formData.get('venue_id') as string,
    category: formData.get('category') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
    status: 'draft'
  };
  
  const { data, error } = await client.from('events').insert(eventData).select().single();
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, eventId: data.id };
};

export default function SubmitEventRoute({ loaderData }: Route.ComponentProps) {
  return <SubmitEventPage 
    venues={loaderData.venues}
    categories={loaderData.categories}
  />;
}