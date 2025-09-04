import type { Route } from '~/types/app/routes/performers/$id/+types';
import { PerformerProfilePage } from '~/components/magic-patterns/pages/performers/PerformerProfilePageSimple';
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
    
    // Load upcoming events for this performer (when event_performers table exists)
    // For now, return empty array
    const upcomingEvents: any[] = [];
    
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