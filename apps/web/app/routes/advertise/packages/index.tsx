import React from 'react';
import { AdPackagesPage } from '~/components/magic-patterns/pages/advertise/AdPackagesPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/advertise/packages/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'AdPackages - GoEventCity',
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData
export default function AdPackagesRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <AdPackagesPage />;
}
