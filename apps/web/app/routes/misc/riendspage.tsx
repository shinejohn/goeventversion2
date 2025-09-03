import type { Route } from '~/types/app/routes/misc/riendspage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import FriendsPage from '~/components/magic-patterns/pages/social/FriendsPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for FriendsPage
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for FriendsPage
  return { success: true };
};

export default function FriendsPagePage() {
  return <FriendsPage />;
}