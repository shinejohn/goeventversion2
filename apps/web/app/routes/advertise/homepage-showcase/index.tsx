import React from 'react';
import { HomepageShowcasePage } from '~/components/magic-patterns/pages/advertise/HomepageShowcasePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/advertise/homepage-showcase/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'HomepageShowcase - GoEventCity',
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
export default function HomepageShowcaseRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <HomepageShowcasePage />;
}
