import { EventsPage } from '~/components/magic-patterns/pages/EventsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route } from '~/types/app/routes/events/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const i18n = await createI18nServerInstance(request);
  
  // For now, we'll return null and let EventsPage use its mock data
  // Later, we'll fetch real events from Supabase like this:
  /*
  const client = getSupabaseServerClient(request);
  const { data: events } = await client
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  */
  
  return {
    title: 'Events - GoEventCity',
    events: null, // Let EventsPage use its own mock data for now
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
    {
      name: 'description',
      content: 'Discover amazing events happening in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData
export default function Events(props: Route.ComponentProps) {
  // Access loader data through props (SSR-safe)
  const { events } = props.loaderData;
  
  // EventsPage doesn't accept props yet, so it will use its own mock data
  return <EventsPage />;
}