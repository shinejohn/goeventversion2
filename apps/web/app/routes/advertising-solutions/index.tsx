import React from 'react';
import { AdvertisingSolutionsPage } from '~/components/magic-patterns/pages/AdvertisingSolutionsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/advertising-solutions';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'AdvertisingSolutions - GoEventCity',
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
export default function AdvertisingSolutionsRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <AdvertisingSolutionsPage />;
}
