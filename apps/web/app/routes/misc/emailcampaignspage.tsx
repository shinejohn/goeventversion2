import React from 'react';
import type { Route } from '~/types/app/routes/misc/mailcampaignspage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { EmailCampaignsPage } from '~/components/magic-patterns/pages/advertise/EmailCampaignsPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for EmailCampaignsPage
  return { data: {} };
};

export default function EmailCampaignsPagePage() {
  return <EmailCampaignsPage />;
}