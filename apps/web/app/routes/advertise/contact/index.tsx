import React from 'react';
import type { Route } from '~/types/app/routes/advertise/contact/+types/index';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AdvertisingContactPage } from '~/components/magic-patterns/pages/advertise/AdvertisingContactPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // No data needed for this page
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement contact form submission
  // This would typically send an email or create a contact request in the database
  
  return { success: true };
}

export default function AdvertisingContactRoute() {
  return <AdvertisingContactPage />;
}