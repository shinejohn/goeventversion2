// apps/web/app/routes/performers/index.tsx
import type { Route } from '~/types/app/routes/performers/index/+types';
import { PerformersPage } from '~/components/magic-patterns/pages/PerformersPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: performers, error } = await client
      .from('performer_profiles')
      .select(`
        *,
        user:auth.users(name, avatar_url),
        upcoming_events:event_performers(
          event:events(id, title, start_date)
        )
      `)
      .eq('status', 'active')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    
    return { performers: performers || [] };
    
  } catch (error) {
    console.error('Error loading performers:', error);
    return { performers: [] };
  }
};

export default function PerformersRoute({ loaderData }: Route.ComponentProps) {
  return <PerformersPage performers={loaderData.performers} />;
}