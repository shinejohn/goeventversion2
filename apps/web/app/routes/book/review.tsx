// apps/web/app/routes/book/review.tsx
import type { Route } from '~/types/app/routes/book/review/+types';
import { ReviewStep } from '~/components/magic-patterns/components/booking/ReviewStep';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { HubPreview } from '~/components/magic-patterns/components/hub-builder/HubPreview';
import { ReviewsSection } from '~/components/magic-patterns/components/venue-detail/ReviewsSection';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  
  // Get booking session data
  const bookingId = url.searchParams.get('bookingId');
  const eventId = url.searchParams.get('eventId');
  const venueId = url.searchParams.get('venueId');
  
  let bookingData = null;
  let eventData = null;
  let venueData = null;
  
  try {
    // Load booking session
    if (bookingId) {
      const { data } = await client
        .from('booking_sessions')
        .select('*')
        .eq('id', bookingId)
        .single();
      bookingData = data;
    }
    
    // Load event data if needed
    if (eventId) {
      const { data } = await client
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      eventData = data;
    }
    
    // Load venue data if needed  
    if (venueId) {
      const { data } = await client
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();
      venueData = data;
    }
    
  } catch (error) {
    console.error('Error loading booking step data:', error);
  }
  
  return {
    booking: bookingData,
    event: eventData,
    venue: venueData,
    currentStep: 5,
    nextStep: 'confirmation'
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const url = new URL(request.url);
  
  try {
    // Get or create booking session
    let bookingId = url.searchParams.get('bookingId');
    
    if (!bookingId) {
      // Create new booking session
      const { data: newBooking, error } = await client
        .from('booking_sessions')
        .insert({
          currentStep: 5,
          data: Object.fromEntries(formData),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .select('id')
        .single();
        
      if (error) throw error;
      bookingId = newBooking.id;
    } else {
      // Update existing booking session
      const { error } = await client
        .from('booking_sessions')
        .update({
          currentStep: 6,
          data: Object.fromEntries(formData),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
    }
    
    // Redirect to next step
    return redirect(`/book/confirmation?bookingId=${bookingId}`);
    
  } catch (error) {
    console.error('Error processing booking step:', error);
    return {
      error: 'Failed to process booking step. Please try again.'
    };
  }
};

export default function ReviewStepRoute({ loaderData, actionData }: Route.ComponentProps) {
  const { booking, event, venue, currentStep } = loaderData;
  
  return <HubPreview />;
}