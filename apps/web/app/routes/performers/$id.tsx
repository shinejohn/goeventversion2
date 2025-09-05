import React from 'react';
import type { Route } from '~/types/app/routes/performers/$id/+types';
import { PerformerProfilePage } from '~/components/magic-patterns/pages/performers/PerformerProfilePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const performerId = params.id;

  try {
    const { data: performer, error } = await client
      .from('performers')
      .select('*')
      .eq('id', performerId)
      .single();
      
    if (error || !performer) {
      throw new Response('Performer not found', { status: 404 });
    }
    
    // Load upcoming events for this performer
    // Note: This assumes we have an event_performers table or performer_id in events table
    // For now, we'll try to load events by checking if the performer name appears in event title or description
    const { data: events } = await client
      .from('events')
      .select(`
        id, title, start_date,
        venue:venues(name)
      `)
      .or(`title.ilike.%${performer.name}%,description.ilike.%${performer.name}%`)
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date')
      .limit(6);
    
    // Transform to match UI expectations
    const upcomingEvents = events?.map(event => ({
      id: event.id,
      title: event.title,
      start_datetime: event.start_date,
      venue: event.venue
    })) || [];
    
    return { 
      performer,
      upcomingEvents 
    };
    
  } catch (error) {
    console.error('Error loading performer:', error);
    throw new Response('Performer not found', { status: 404 });
  }
};

export default function PerformerDetailRoute({ loaderData }: Route.ComponentProps) {
  return <PerformerProfilePage performer={loaderData.performer} upcomingEvents={loaderData.upcomingEvents} />;
}