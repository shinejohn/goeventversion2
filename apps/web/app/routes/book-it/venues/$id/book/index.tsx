import { BookingRequestPage } from '~/components/magic-patterns/pages/book-it/venues/BookingRequestPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/book-it/venues/$id/book/+types';
import { json, redirect } from 'react-router';

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
