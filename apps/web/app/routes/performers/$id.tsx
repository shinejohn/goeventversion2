import type { Route } from '~/types/app/routes/performers/$id';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const performerId = params.id;

  // TODO: Load performer data from database
  const performer = {
    id: performerId,
    name: 'Sample Performer',
    description: 'Professional performer with years of experience',
    image: '/placeholder-performer.jpg'
  };

  return { performer };
};

export default function PerformerDetailPage() {
  // This will be properly implemented with Magic Patterns components
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Performer Detail Page</h1>
      <p className="text-gray-600">This page will display performer details using Magic Patterns components.</p>
    </div>
  );
}