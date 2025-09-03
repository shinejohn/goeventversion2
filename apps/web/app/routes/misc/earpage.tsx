import type { Route } from '~/types/app/routes/misc/earpage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { GearPage } from '~/components/magic-patterns/pages/GearPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for GearPage
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for GearPage
  return { success: true };
};

export default function GearPagePage() {
  return <GearPage />;
}