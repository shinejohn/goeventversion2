import React from 'react';
import { CommunityImpactPage } from '~/components/magic-patterns/pages/CommunityImpactPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/community-impact/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'CommunityImpact - GoEventCity',
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
export default function CommunityImpactRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <CommunityImpactPage />;
}
