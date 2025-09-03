import type { Route } from '~/types/app/routes/misc/ontactuspage';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ContactUsPage } from '~/components/magic-patterns/pages/ContactUsPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for ContactUsPage
  return { data: {} };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for ContactUsPage
  return { success: true };
};

export default function ContactUsPagePage() {
  return <ContactUsPage />;
}