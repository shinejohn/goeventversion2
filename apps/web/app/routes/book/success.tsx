import React from 'react';
// apps/web/app/routes/book/success.tsx
import type { Route } from './+types/success';
import { BookingConfirmation } from '~/components/magic-patterns/components/booking-form/BookingConfirmation';
import { ConfettiCelebration } from '~/components/magic-patterns/components/bookings/ConfettiCelebration';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { SuccessStoriesPage } from '~/components/magic-patterns/pages/SuccessStoriesPage';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  const bookingId = url.searchParams.get('bookingId');
  
  if (!bookingId) {
    console.warn('Booking ID not provided in success page');
    return { booking: null };
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
      console.warn('Booking not found:', bookingId);
      return { booking: null };
    }
    
    return { booking };
    
  } catch (error) {
    console.error('Error loading booking confirmation:', error);
    return { booking: null };
  }
};

export default function BookingSuccessRoute({ loaderData }: Route.ComponentProps) {
  const { booking } = loaderData;
  
  return <SuccessStoriesPage />;
}