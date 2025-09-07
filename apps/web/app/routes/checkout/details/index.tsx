import React from 'react';
import type { Route } from './+types/details/index';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { CheckoutDetailsPage } from '~/components/magic-patterns/pages/checkout/CheckoutDetailsPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // Order data is managed in sessionStorage
  // Could load user profile data here if authenticated
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Handle customer info submission
  // Could create guest account or validate user
  
  return { success: true };
}

export default function CheckoutDetailsRoute() {
  return <CheckoutDetailsPage />;
}