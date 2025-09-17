import React from 'react';
import { useSearchParams } from 'react-router';
import type { Route } from './+types/route.ts';
import { AdvertiseSuccessPage } from '~/components/magic-patterns/pages/advertise/AdvertiseSuccessPage';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const plan = url.searchParams.get('plan') || 'professional';
  
  return { 
    title: 'Purchase Successful - GoEventCity',
    selectedPlan: plan
  };
}

export default function AdvertiseSuccessRoute() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'professional';
  
  return <AdvertiseSuccessPage selectedPlan={plan} />;
}