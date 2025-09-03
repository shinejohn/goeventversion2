import { VenueDetailPage } from '~/components/magic-patterns/pages/book-it/venues/VenueDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/book-it/venues/$id/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'VenueDetail - GoEventCity',
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
export default function VenueDetailRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <VenueDetailPage />;
}
