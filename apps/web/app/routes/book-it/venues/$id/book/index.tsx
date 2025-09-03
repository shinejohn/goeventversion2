import { BookingRequestPage } from '~/components/magic-patterns/pages/book-it/venues/BookingRequestPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/book-it/venues/$id/book/+types';
import { redirect } from 'react-router';
import { MarginEventAds } from '~/components/magic-patterns/components/ads/MarginEventAds';
import { EventCard } from '~/components/magic-patterns/components/calendar/EventCard';
import { EventList } from '~/components/magic-patterns/components/calendar/EventList';
import { PlannedEventsWidget } from '~/components/magic-patterns/components/check-in/PlannedEventsWidget';
import { ContentTabs } from '~/components/magic-patterns/components/events/ContentTabs';
import { EventHero } from '~/components/magic-patterns/components/events/EventHero';
import { EventSuggestionModal } from '~/components/magic-patterns/components/events/EventSuggestionModal';
import { RelatedEvents } from '~/components/magic-patterns/components/events/RelatedEvents';
import { VenueMap } from '~/components/magic-patterns/components/venue-marketplace/VenueMap';
import { RevenueReports } from '~/components/magic-patterns/components/hub/analytics/RevenueReports';
import { EnhancedEventCard } from '~/components/magic-patterns/components/hub/events/EnhancedEventCard';
import { EventFilters } from '~/components/magic-patterns/components/hub/events/EventFilters';
import { EventViewToggle } from '~/components/magic-patterns/components/hub/events/EventViewToggle';
import { ListView } from '~/components/magic-patterns/components/hub/events/ListView';
import { SimilarVenues } from '~/components/magic-patterns/components/venue-detail/SimilarVenues';
import { VenueCard } from '~/components/magic-patterns/components/venue-marketplace/VenueCard';
import { VenueListItem } from '~/components/magic-patterns/components/venue-marketplace/VenueListItem';
import { mockEvents } from '~/components/magic-patterns/mockdata/events';
import { mockVenues } from '~/components/magic-patterns/mockdata/venues';
import { EventDetailPage } from '~/components/magic-patterns/pages/EventDetailPage';
import { EventOrganizerHubPage } from '~/components/magic-patterns/pages/EventOrganizerHubPage';
import { EventsPage } from '~/components/magic-patterns/pages/EventsPage';
import { ListYourVenuePage } from '~/components/magic-patterns/pages/ListYourVenuePage';
import { VenuesPage } from '~/components/magic-patterns/pages/VenuesPage';
import { EventPromotionPage } from '~/components/magic-patterns/pages/advertise/EventPromotionPage';
import { BookVenuePage } from '~/components/magic-patterns/pages/book/BookVenuePage';
import { VenueMarketplacePage } from '~/components/magic-patterns/pages/book-it/VenueMarketplacePage';
import { VenueDetailPage } from '~/components/magic-patterns/pages/venues/VenueDetailPage';
import { TicketCreatorPage } from '~/components/magic-patterns/pages/events/TicketCreatorPage';
import { HubEventsPage } from '~/components/magic-patterns/pages/hub/[slug]/events';
import { venues } from '~/components/magic-patterns/pages/my/venues';
import { NewVenuesPage } from '~/components/magic-patterns/pages/venues/NewVenuesPage';
import { SubmitVenuePage } from '~/components/magic-patterns/pages/venues/SubmitVenuePage';
import { TrendingVenuesPage } from '~/components/magic-patterns/pages/venues/TrendingVenuesPage';
import { VenueManagementPage } from '~/components/magic-patterns/pages/venues/VenueManagementPage';
// Note: Components with bracket notation in paths need proper mapping
// import { VenueSlugPage } from '~/components/magic-patterns/pages/venues/[venueId]/[venueSlug]';
// import { BookVenuePage } from '~/components/magic-patterns/pages/venues/[venueId]/book';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'BookingRequest - GoEventCity',
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  // TODO: Implement booking logic
  // const supabase = getSupabaseServerClient(request);
  // const { data: booking, error } = await supabase.from('bookings').insert(data);
  
  return redirect('/bookings/confirmation');
};

export default function BookingRequestRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <BookingRequestPage />;
}
