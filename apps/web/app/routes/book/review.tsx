import React from 'react';
// apps/web/app/routes/book/review.tsx
import type { Route } from './+types/review';
import { ReviewStep } from '~/components/magic-patterns/components/booking/ReviewStep';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

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
  
  // TODO: Implement proper ReviewStep rendering with actual booking data
  // This is a temporary implementation until booking flow is fully integrated
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <ReviewStep 
            venue={venue || {
              name: 'Venue Name',
              images: ['https://via.placeholder.com/400x300'],
              location: { address: 'Venue Address' },
              pricePerHour: 100,
              houseRules: ['No smoking', 'Clean up after event']
            }}
            formData={booking?.data || {
              primaryDate: new Date().toISOString().split('T')[0],
              alternativeDates: [],
              startTime: '18:00',
              endTime: '22:00',
              setupTime: '30 minutes',
              breakdownTime: '30 minutes',
              expectedAttendance: 50,
              ageRange: 'All ages',
              eventType: 'Private',
              eventTypeOther: '',
              eventName: 'Event Name',
              additionalServices: {
                eventStaff: false,
                security: false,
                cleaning: false,
                equipmentRental: false
              },
              messageToVenue: '',
              agreeHouseRules: false,
              agreePlatformTerms: false,
              authorizePayment: false
            }}
            pricing={{
              basePrice: 400,
              setupCost: 0,
              breakdownCost: 0,
              additionalServicesCost: 0,
              subtotal: 400,
              serviceFee: 40,
              total: 440
            }}
            onInputChange={(e) => {
              // TODO: Handle input changes
            }}
            onCheckboxChange={(e) => {
              // TODO: Handle checkbox changes
            }}
            onPrevStep={() => {
              // TODO: Navigate to previous step
              window.history.back();
            }}
            onNextStep={() => {
              // TODO: Submit form and navigate to payment
              const form = document.querySelector('form');
              if (form) form.submit();
            }}
          />
        </div>
      </div>
    </div>
  );
}