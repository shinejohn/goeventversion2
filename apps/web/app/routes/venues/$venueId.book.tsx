import { Form, redirect, useActionData } from 'react-router';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

const bookingSchema = z.object({
  venue_id: z.string().uuid(),
  event_name: z.string().min(1, 'Event name is required'),
  event_type: z.string().min(1, 'Event type is required'),
  date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  guest_count: z.number().min(1, 'Guest count must be at least 1'),
  setup_requirements: z.string().optional(),
  services: z.array(z.string()).optional(),
  contact_person: z.object({
    name: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Invalid phone number')
  }),
  special_requests: z.string().optional(),
  subtotal: z.number().positive(),
  payment_method: z.string().optional()
});

export async function action({ request, params }: { request: Request; params: any }) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  // Get user's account
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .single();

  try {
    // Parse form data
    const bookingData = bookingSchema.parse({
      venue_id: params.venueId,
      event_name: formData.get('eventName'),
      event_type: formData.get('eventType'),
      date: formData.get('date'),
      start_time: formData.get('startTime'),
      end_time: formData.get('endTime'),
      guest_count: parseInt(formData.get('guestCount') as string),
      setup_requirements: formData.get('setupRequirements'),
      services: JSON.parse(formData.get('services') as string || '[]'),
      contact_person: {
        name: formData.get('contactName') as string,
        email: formData.get('contactEmail') as string,
        phone: formData.get('contactPhone') as string
      },
      special_requests: formData.get('specialRequests'),
      subtotal: parseFloat(formData.get('subtotal') as string),
      payment_method: formData.get('paymentMethod')
    });

    // Create booking
    const { data: booking, error } = await client
      .from('bookings')
      .insert({
        venue_id: bookingData.venue_id,
        user_id: user.id,
        account_id: account?.id || user.id,
        event_name: bookingData.event_name,
        event_type: bookingData.event_type,
        date: bookingData.date,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        guest_count: bookingData.guest_count,
        setup_requirements: bookingData.setup_requirements,
        services: bookingData.services,
        contact_person: bookingData.contact_person,
        special_requests: bookingData.special_requests,
        subtotal: bookingData.subtotal,
        payment_method: bookingData.payment_method,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Booking creation error:', error);
      return { error: 'Failed to create booking' };
    }

    // Redirect to confirmation page
    return redirect(`/bookings/${booking.id}/confirmation`);

  } catch (error) {
    console.error('Validation error:', error);
    return { error: 'Invalid booking data' };
  }
}

export default function VenueBookingRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
      
      {actionData?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {actionData.error}
        </div>
      )}

      {/* The BookingFormProgress component would be imported and used here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p>Booking form will be integrated here</p>
      </div>
    </div>
  );
}