import React from 'react';
import type { Route } from '~/types/app/routes/my/calendar';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load user's calendar data
  return {};
}

export default function MyCalendarRoute() {
  // Import dynamically to avoid SSR issues
  const CalendarComponent = React.lazy(() => 
    import('~/components/magic-patterns/pages/my/calendar').then(mod => ({
      default: mod.default || (() => <div>Calendar</div>)
    }))
  );

  return (
    <React.Suspense fallback={<div>Loading calendar...</div>}>
      <CalendarComponent />
    </React.Suspense>
  );
}