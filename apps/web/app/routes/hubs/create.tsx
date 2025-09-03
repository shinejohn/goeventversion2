// apps/web/app/routes/hubs/create.tsx
import type { Route } from '~/types/app/routes/hubs/create/+types';
import { SetupWizard } from '~/components/magic-patterns/components/hub-builder/SetupWizard';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  try {
    const hubData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      privacy: formData.get('privacy'),
      settings: JSON.parse(formData.get('settings') || '{}')
    };
    
    const { data: hub, error } = await client
      .from('community_hubs')
      .insert(hubData)
      .select('slug')
      .single();
      
    if (error) throw error;
    
    return redirect(`/hubs/${hub.slug}`);
    
  } catch (error) {
    console.error('Error creating hub:', error);
    return { error: 'Failed to create hub' };
  }
};

export default function CreateHubRoute({ actionData }: Route.ComponentProps) {
  return (
    <div className="create-hub-container">
      <SetupWizard error={actionData?.error} />
    </div>
  );
}