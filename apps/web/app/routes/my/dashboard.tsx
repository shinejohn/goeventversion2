import React from 'react';
import type { Route } from '~/types/app/routes/my/dashboard';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // TODO: Load user's dashboard data
  return {};
}

export default function MyDashboardRoute() {
  // Import dynamically to avoid SSR issues
  const DashboardComponent = React.lazy(() => 
    import('~/components/magic-patterns/pages/my/dashboard').then(mod => ({
      default: mod.default || (() => <div>Dashboard</div>)
    }))
  );

  return (
    <React.Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardComponent />
    </React.Suspense>
  );
}