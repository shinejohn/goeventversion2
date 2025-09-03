// apps/web/app/routes/book/success.tsx
import type { Route } from '~/types/app/routes/book/success/+types';
import { BookingConfirmation } from '~/components/magic-patterns/components/booking-form/BookingConfirmation';
import { ConfettiCelebration } from '~/components/magic-patterns/components/bookings/ConfettiCelebration';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { SuccessStoriesPage } from '~/components/magic-patterns/pages/SuccessStoriesPage';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  const bookingId = url.searchParams.get('bookingId');
  
  if (!bookingId) {
    throw new Response('Booking not found', { status: 404 });
  }
  
  try {
    // Load completed booking
    const { data: booking } = await client
      .from('bookings')
      .select(`
        *,
        event:events(*),
        venue:venues(*)
      `)
      .eq('id', bookingId)
      .single();
      
    if (!booking) {
      throw new Response('Booking not found', { status: 404 });
    }
    
    return { booking };
    
  } catch (error) {
    console.error('Error loading booking confirmation:', error);
    throw new Response('Error loading booking', { status: 500 });
  }
};

export default function BookingSuccessRoute({ loaderData }: Route.ComponentProps) {
  const { booking } = loaderData;
  
  return <SuccessStoriesPage />;
}