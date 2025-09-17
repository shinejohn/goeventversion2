import React from 'react';
import type { Route } from './+types/route.ts';
import { useLoaderData, useSearchParams } from 'react-router';
import { AdvertisingPurchasePage } from '~/components/magic-patterns/pages/advertise/AdvertisingPurchasePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const plan = url.searchParams.get('plan') || 'professional';
  
  return { 
    title: 'Purchase Advertising Package - GoEventCity',
    selectedPlan: plan
  };
}

export default function AdvertisingPurchaseRoute() {
  const { selectedPlan } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || selectedPlan;
  
  return <AdvertisingPurchasePage selectedPlan={plan} />;
}