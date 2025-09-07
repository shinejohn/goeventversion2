import React from 'react';
import type { Route } from '~/types/app/routes/my/venues';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load user's venues data
  return {};
}

export default function MyVenuesRoute() {
  // Import dynamically to avoid SSR issues
  const VenuesComponent = React.lazy(() => 
    import('~/components/magic-patterns/pages/my/venues').then(mod => ({
      default: mod.default || (() => <div>My Venues</div>)
    }))
  );

  return (
    <React.Suspense fallback={<div>Loading venues...</div>}>
      <VenuesComponent />
    </React.Suspense>
  );
}