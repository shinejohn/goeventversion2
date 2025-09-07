import React from 'react';
import type { Route } from '~/types/app/routes/page-directory';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageDirectory } from '~/components/magic-patterns/pages/PageDirectory';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // Page directory is a static component
  return {};
}

export default function PageDirectoryRoute() {
  return <PageDirectory />;
}