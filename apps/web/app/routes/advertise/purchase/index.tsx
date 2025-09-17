import React from 'react';
import { json, type LoaderFunctionArgs } from '@react-router/node';
import { useLoaderData, useSearchParams } from '@react-router/react';
import { AdvertisingPurchasePage } from '~/components/magic-patterns/pages/advertise/AdvertisingPurchasePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const plan = url.searchParams.get('plan') || 'professional';
  
  return json({ 
    title: 'Purchase Advertising Package - GoEventCity',
    selectedPlan: plan
  });
}

export default function AdvertisingPurchaseRoute() {
  const { selectedPlan } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || selectedPlan;
  
  return <AdvertisingPurchasePage selectedPlan={plan} />;
}