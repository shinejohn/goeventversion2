import React from 'react';
// apps/web/app/routes/bookings/$id.tsx
import type { Route } from './+types/$id';
import { BookingSummaryCard } from '~/components/magic-patterns/components/bookings/BookingSummaryCard';
import { ActionButtons } from '~/components/magic-patterns/components/bookings/ActionButtons';
import { VenueInformation } from '~/components/magic-patterns/components/bookings/VenueInformation';
import { FinancialBreakdown } from '~/components/magic-patterns/components/bookings/FinancialBreakdown';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const bookingId = params.id;
  
  try {
    // Load booking with related data
    const { data: booking } = await client
      .from('bookings')
      .select(`
        *,
        event:events(*),
        venue:venues(*),
        user:auth.users(*)
      `)
      .eq('id', bookingId)
      .single();
      
    if (!booking) {
      throw new Response('Booking not found', { status: 404 });
    }
    
    return { booking };
    
  } catch (error) {
    console.error('Error loading booking:', error);
    throw new Response('Error loading booking', { status: 500 });
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('action');
  const bookingId = params.id;
  
  try {
    switch (action) {
      case 'cancel':
        await client
          .from('bookings')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('id', bookingId);
        break;
        
      case 'confirm':
        await client
          .from('bookings')
          .update({ status: 'confirmed', updated_at: new Date().toISOString() })
          .eq('id', bookingId);
        break;
        
      case 'modify':
        // Handle booking modification logic
        break;
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Error updating booking:', error);
    return { error: 'Failed to update booking' };
  }
};

export default function BookingDetailRoute({ loaderData, actionData }: Route.ComponentProps) {
  const { booking } = loaderData;
  
  return (
    <div className="booking-detail-container">
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <BookingSummaryCard 
              booking={booking}
              event={booking.event}
            />
            
            <VenueInformation
              venue={booking.venue}
              event={booking.event}
            />
          </div>
          
          <div className="space-y-6">
            <FinancialBreakdown
              booking={booking}
              venue={booking.venue}
              event={booking.event}
            />
            
            <ActionButtons
              bookingId={booking.id}
              booking={booking}
              venue={booking.venue}
              event={booking.event}
            />
          </div>
        </div>
      </div>
    </div>
  );
}