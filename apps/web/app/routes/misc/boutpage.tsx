import type { Route } from '~/types/app/routes/misc/boutpage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AboutPage } from '~/components/magic-patterns/pages/AboutPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for AboutPage
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for AboutPage
  return { success: true };
};

export default function AboutPagePage() {
  return <AboutPage />;
}