import React from 'react';
import type { Route } from '~/types/app/routes/misc/artnerwithuspage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PartnerWithUsPage } from '~/components/magic-patterns/pages/PartnerWithUsPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for PartnerWithUsPage
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for PartnerWithUsPage
  return { success: true };
};

export default function PartnerWithUsPagePage() {
  return <PartnerWithUsPage />;
}