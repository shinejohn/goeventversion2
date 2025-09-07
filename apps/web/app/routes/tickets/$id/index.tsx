import React from 'react';
import { TicketDetailPage } from '~/components/magic-patterns/pages/tickets/TicketDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/$id';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'TicketDetail - GoEventCity',
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
export default function TicketDetailRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <TicketDetailPage />;
}
