import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import type { Route } from '~/types/app/routes/api/+types/checkin';

const CheckinSchema = z.object({
  venue_id: z.string().uuid().optional(),
  venue_name: z.string().min(1),
  event_id: z.string().uuid().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
  mood: z.string().optional(),
  privacy: z.enum(['public', 'friends', 'private']).default('friends'),
});

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  const client = getSupabaseServerClient(request);
  
  // Get current user
  const { data: { user }, error: authError } = await client.auth.getUser();
  
  if (authError || !user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const data = CheckinSchema.parse(body);

    const { data: checkin, error } = await client
      .from('checkins')
      .insert({
        user_id: user.id,
        venue_id: data.venue_id,
        venue_name: data.venue_name,
        event_id: data.event_id,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        note: data.note,
        mood: data.mood,
        privacy: data.privacy,
      })
      .select()
      .single();

    if (error) {
      throw new Response(error.message, { status: 400 });
    }

    return { success: true, checkin };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Response(JSON.stringify({ error: 'Invalid data', issues: error.issues }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw new Response('Internal server error', { status: 500 });
  }
}