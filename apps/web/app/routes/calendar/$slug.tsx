import React from 'react';
import { CalendarSlugPage } from '~/components/magic-patterns/pages/calendar/[slug]';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/$slug';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const calendarSlug = params.slug;
  
  try {
    // Load calendar by slug
    const { data: calendar, error } = await client
      .from('calendars')
      .select(`
        *,
        owner:accounts(name, picture_url),
        events(*, venue:venues(name, address))
      `)
      .eq('slug', calendarSlug)
      .single();
      
    if (error || !calendar) {
      throw new Response('Calendar not found', { status: 404 });
    }
    
    return { calendar };
  } catch (error) {
    console.error('Calendar loader error:', error);
    throw new Response('Calendar not found', { status: 404 });
  }
};

export default function CalendarRoute({ loaderData }: Route.ComponentProps) {
  return <CalendarSlugPage calendar={loaderData.calendar} />;
}