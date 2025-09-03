// apps/web/app/routes/book/confirmation.tsx
import type { Route } from '~/types/app/routes/book/confirmation/+types';
import { ConfirmationStep } from '~/components/magic-patterns/components/booking/ConfirmationStep';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { EventDetailsStep } from '~/components/magic-patterns/components/booking/EventDetailsStep';
import { ProgressIndicator } from '~/components/magic-patterns/components/booking/ProgressIndicator';
import { RequirementsStep } from '~/components/magic-patterns/components/booking/RequirementsStep';
import { ReviewStep } from '~/components/magic-patterns/components/booking/ReviewStep';
import { SubmitStep } from '~/components/magic-patterns/components/booking/SubmitStep';
import { BookingFormProgress } from '~/components/magic-patterns/components/booking-form/BookingFormProgress';
import { EventDetailsForm } from '~/components/magic-patterns/components/booking-form/EventDetailsForm';
import { ReviewSubmitForm } from '~/components/magic-patterns/components/booking-form/ReviewSubmitForm';
import { ServicesAddonsForm } from '~/components/magic-patterns/components/booking-form/ServicesAddonsForm';
import { SpaceSetupForm } from '~/components/magic-patterns/components/booking-form/SpaceSetupForm';
import { ActionButtons } from '~/components/magic-patterns/components/bookings/ActionButtons';
import { BookingSummaryCard } from '~/components/magic-patterns/components/bookings/BookingSummaryCard';
import { ConfettiCelebration } from '~/components/magic-patterns/components/bookings/ConfettiCelebration';
import { FinancialBreakdown } from '~/components/magic-patterns/components/bookings/FinancialBreakdown';
import { VenueInformation } from '~/components/magic-patterns/components/bookings/VenueInformation';
import { CalendarEngagementBar } from '~/components/magic-patterns/components/calendar/CalendarEngagementBar';
import { CalendarGrid } from '~/components/magic-patterns/components/dashboard/calendars/CalendarGrid';
import { CalendarHeader } from '~/components/magic-patterns/components/calendar/CalendarHeader';
import { CalendarPreview } from '~/components/magic-patterns/components/calendar/CalendarPreview';
import { CalendarSidebar } from '~/components/magic-patterns/components/calendar/CalendarSidebar';
import { CalendarTabs } from '~/components/magic-patterns/components/calendar/CalendarTabs';
import { CalendarWizard } from '~/components/magic-patterns/components/calendar/CalendarWizard';
import { CalendarCard } from '~/components/magic-patterns/components/calendars/CalendarCard';
import { CalendarFilters } from '~/components/magic-patterns/components/calendars/CalendarFilters';
import { FeaturedCalendars } from '~/components/magic-patterns/components/calendars/FeaturedCalendars';
import { CalendarView } from '~/components/magic-patterns/components/hub/events/CalendarView';
import { PerformerCalendar } from '~/components/magic-patterns/components/performers/PerformerCalendar';
import { AvailabilityCalendar } from '~/components/magic-patterns/components/venue-detail/AvailabilityCalendar';
import { BookingRequestPopup } from '~/components/magic-patterns/components/venue-detail/BookingRequestPopup';
import { BookingWidget } from '~/components/magic-patterns/components/venue-detail/BookingWidget';
import { BookingMarketplacePage } from '~/components/magic-patterns/pages/BookingMarketplacePage';
import { CalendarPage } from '~/components/magic-patterns/pages/CalendarPage';
import { BookingRequestPage } from '~/components/magic-patterns/pages/book-it/venues/BookingRequestPage';
import { CalendarMarketplacePage } from '~/components/magic-patterns/pages/calendars/CalendarMarketplacePage';
import { CalendarDashboardPage } from '~/components/magic-patterns/pages/dashboard/calendars';
import { calendar } from '~/components/magic-patterns/pages/my/calendar';

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
    currentStep: 6,
    nextStep: 'success'
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
          currentStep: 6,
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
          currentStep: 7,
          data: Object.fromEntries(formData),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
    }
    
    // Redirect to next step
    return redirect(`/book/success?bookingId=${bookingId}`);
    
  } catch (error) {
    console.error('Error processing booking step:', error);
    return {
      error: 'Failed to process booking step. Please try again.'
    };
  }
};

export default function ConfirmationStepRoute({ loaderData, actionData }: Route.ComponentProps) {
  const { booking, event, venue, currentStep } = loaderData;
  
  return <EventDetailsStep />;
}