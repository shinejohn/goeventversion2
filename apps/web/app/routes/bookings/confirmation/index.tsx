import React from 'react';
import { BookingConfirmationPage } from '~/components/magic-patterns/pages/bookings/BookingConfirmationPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/bookings/confirmation/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'BookingConfirmation - GoEventCity',
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
export default function BookingConfirmationRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <BookingConfirmationPage />;
}
