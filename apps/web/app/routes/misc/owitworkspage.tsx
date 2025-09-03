import type { Route } from '~/types/app/routes/misc/owitworkspage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { HowItWorksPage } from '~/components/magic-patterns/pages/HowItWorksPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for HowItWorksPage
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for HowItWorksPage
  return { success: true };
};

export default function HowItWorksPagePage() {
  return <HowItWorksPage />;
}