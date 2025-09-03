import { type LoaderFunctionArgs } from 'react-router';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { GeolocationService } from '~/lib/services/geolocation.service';
import { createDataService } from '~/lib/services/data-service';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const communitySlug = params.communitySlug;
  if (!communitySlug) {
    throw new Response('Community not found', { status: 404 });
  }

  const client = getSupabaseServerClient(request);
  const dataService = createDataService(client);

  // Get user if authenticated (optional)
  const { data: { user } } = await client.auth.getUser();

  // Fetch community data and events in parallel
  const [community, events, nearbyCommunities] = await Promise.all([
    dataService.getCommunity(communitySlug),
    dataService.getEvents(communitySlug),
    dataService.getNearbyCommunities(communitySlug, 50) // 50 mile radius
  ]);

  if (!community) {
    throw new Response('Community not found', { status: 404 });
  }

  // Set cache headers for Cloudflare
  const headers = new Headers();
  
  // Cache community calendar pages at edge for 5 minutes
  // But vary by user authentication
  headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60');
  headers.set('Vary', 'Cookie, Accept-Encoding');
  
  // Tag-based cache invalidation
  headers.set('Cache-Tag', `community-${community.slug},events-${community.id}`);
  
  return {
    community,
    events,
    nearbyCommunities,
    user
  }, { headers };
}

export default function CommunityCalendarPage() {
  const { community, events, nearbyCommunities, user } = useLoaderData<typeof loader>();

  return (
    <CalendarContainer
      community={community}
      events={events}
      nearbyCommunities={nearbyCommunities}
      user={user}
    />
  );
}