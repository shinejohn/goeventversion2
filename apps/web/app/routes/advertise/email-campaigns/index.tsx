import React from 'react';
import { EmailCampaignsPage } from '~/components/magic-patterns/pages/advertise/EmailCampaignsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/advertise/email-campaigns/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'EmailCampaigns - GoEventCity',
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
export default function EmailCampaignsRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <EmailCampaignsPage />;
}
