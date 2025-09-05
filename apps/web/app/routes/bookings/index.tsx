import React from 'react';
import { BookingMarketplacePage } from '~/components/magic-patterns/pages/BookingMarketplacePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/bookings/+types';
import { redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'BookingMarketplace - GoEventCity',
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

export default function BookingMarketplaceRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <BookingMarketplacePage />;
}
