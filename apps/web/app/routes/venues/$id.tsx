// apps/web/app/routes/venues/$id.tsx  
import { VenueDetailPage } from '~/components/magic-patterns/pages/venues/VenueDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const venueId = params.id;
  
  try {
    const { data: venue, error } = await client
      .from('venues')
      .select(`
        *,
        events:events!venue_id(
          id, title, start_date, end_date, image_url
        ),
        reviews:venue_reviews(
          rating, comment,
          user:auth.users(name, avatar_url)
        )
      `)
      .eq('id', venueId)
      .single();
      
    if (error || !venue) {
      throw new Response('Venue not found', { status: 404 });
    }
    
    return { venue };
    
  } catch (error) {
    console.error('Error loading venue:', error);
    throw new Response('Venue not found', { status: 404 });
  }
};

export default function VenueDetailRoute({ loaderData }: Route.ComponentProps) {
  return <VenueDetailPage venue={loaderData.venue} />;
}