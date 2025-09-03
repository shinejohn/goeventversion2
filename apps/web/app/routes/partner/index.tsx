import { PartnerWithUsPage } from '~/components/magic-patterns/pages/PartnerWithUsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/partner/+types';
import { redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'PartnerWithUs - GoEventCity',
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

export default function PartnerWithUsRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <PartnerWithUsPage />;
}
