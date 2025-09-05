import React from 'react';
import { EventPromotionPage } from '~/components/magic-patterns/pages/advertise/EventPromotionPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/advertise/event-promotion/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'EventPromotion - GoEventCity',
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
export default function EventPromotionRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <EventPromotionPage />;
}
