import React from 'react';
import { HowItWorksPage } from '~/components/magic-patterns/pages/HowItWorksPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/how-it-works';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'HowItWorks - GoEventCity',
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
export default function HowItWorksRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <HowItWorksPage />;
}
