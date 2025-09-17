import React from 'react';
import { json, type LoaderFunctionArgs } from '@react-router/node';
import { useSearchParams } from '@react-router/react';
import { AdvertiseSuccessPage } from '~/components/magic-patterns/pages/advertise/AdvertiseSuccessPage';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const plan = url.searchParams.get('plan') || 'professional';
  
  return json({ 
    title: 'Purchase Successful - GoEventCity',
    selectedPlan: plan
  });
}

export default function AdvertiseSuccessRoute() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'professional';
  
  return <AdvertiseSuccessPage selectedPlan={plan} />;
}