import React from 'react';
import { json, type LoaderFunctionArgs } from '@react-router/node';
import { AdvertiseContactPage } from '~/components/magic-patterns/pages/advertise/AdvertiseContactPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ 
    title: 'Contact Sales - GoEventCity'
  });
}

export default function AdvertiseContactRoute() {
  return <AdvertiseContactPage />;
}