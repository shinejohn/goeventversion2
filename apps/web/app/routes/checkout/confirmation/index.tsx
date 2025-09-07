import React from 'react';
import type { Route } from '~/types/app/routes/checkout/confirmation/+types/index';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { CheckoutConfirmationPage } from '~/components/magic-patterns/pages/checkout/CheckoutConfirmationPage';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // Confirmation data is stored in sessionStorage client-side
  // Could optionally verify order from database here
  return {};
}

export default function CheckoutConfirmationRoute() {
  return <CheckoutConfirmationPage />;
}