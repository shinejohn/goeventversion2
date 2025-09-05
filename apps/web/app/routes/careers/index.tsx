import React from 'react';
import { CareersPage } from '~/components/magic-patterns/pages/CareersPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/careers/+types';
import { redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'Careers - GoEventCity',
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

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  // TODO: Implement form processing logic
  
  return { success: true };
};

export default function CareersRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <CareersPage />;
}
