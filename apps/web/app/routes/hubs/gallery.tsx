import React from 'react';
import type { Route } from '~/types/app/routes/hubs/gallery';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
// TODO: Import gallery component when available

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for gallery
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for gallery
  return { success: true };
};

export default function galleryPage() {
  return <gallery />;
}