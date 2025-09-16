import type { Route } from './+types/create';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { EventCreationStart } from '~/components/magic-patterns/components/events/create/EventCreationStart';

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const client = getSupabaseServerClient(request);
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (!user || userError) {
      return redirect('/auth/sign-in?redirectTo=/events/create');
    }
    
    return { user };
  } catch (error) {
    console.error('Loader error:', error);
    return redirect('/auth/sign-in?redirectTo=/events/create');
  }
};

export const action = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (!user || userError) {
    return { error: 'You must be logged in to create an event' };
  }

  // Get user's community (using their personal account ID as community_id for now)
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .eq('is_personal_account', true)
    .single();

  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    venue_id: formData.get('venue_id') as string || null,
    start_datetime: formData.get('start_datetime') as string,
    end_datetime: formData.get('end_datetime') as string || formData.get('start_datetime') as string,
    price_min: parseFloat(formData.get('price') as string) || 0,
    price_max: parseFloat(formData.get('price') as string) || 0,
    capacity: parseInt(formData.get('capacity') as string) || 100,
    status: 'published',
    visibility: 'public',
    image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200',
    organizer_id: user.id,
    community_id: account?.id || user.id, // Use account ID or fall back to user ID
    account_id: account?.id || user.id,
    slug: formData.get('title')?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  const { data, error } = await client
    .from('events')
    .insert(eventData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating event:', error);
    return { error: error.message };
  }
  
  return redirect(`/events/${data.id}`);
};

export default function CreateEventPage({ loaderData, actionData }: Route.ComponentProps) {
  return <EventCreationStart />;
}