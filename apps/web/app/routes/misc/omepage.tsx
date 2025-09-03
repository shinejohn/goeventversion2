import type { Route } from '~/types/app/routes/misc/omepage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { HomePage } from '~/components/magic-patterns/pages/HomePage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for HomePage
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for HomePage
  return { success: true };
};

export default function HomePagePage() {
  return <HomePage />;
}