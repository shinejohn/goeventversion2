// apps/web/app/routes/book/layout.tsx
import { Outlet } from 'react-router';
import type { Route } from '~/types/app/routes/book/+types/layout';
import { ProgressIndicator } from '~/components/magic-patterns/components/booking/ProgressIndicator';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Load current booking session from cookie/session
  const url = new URL(request.url);
  const bookingId = url.searchParams.get('bookingId');
  
  let currentBooking = null;
  if (bookingId) {
    try {
      // Load booking progress from session or database
      const { data } = await client
        .from('booking_sessions')
        .select('*')
        .eq('id', bookingId)
        .single();
      currentBooking = data;
    } catch (error) {
      console.log('No existing booking session');
    }
  }
  
  return { 
    currentBooking,
    bookingId: bookingId || null
  };
};

export default function BookingLayout({ loaderData }: Route.ComponentProps) {
  const { currentBooking } = loaderData;
  
  return (
    <div className="booking-workflow min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProgressIndicator 
          currentStep={currentBooking?.currentStep || 1}
          totalSteps={6}
        />
        
        <main className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}