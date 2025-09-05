import type { ActionFunctionArgs } from 'react-router';
import { json } from 'react-router';
import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

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

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw json({ error: 'Method not allowed' }, { status: 405 });
  }

  const client = getSupabaseServerClient(request);
  
  // Get current user
  const { data: { user }, error: authError } = await client.auth.getUser();
  
  if (authError || !user) {
    throw json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const data = CheckinSchema.parse(Object.fromEntries(formData));

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
      throw json({ error: error.message }, { status: 400 });
    }

    return json({ success: true, checkin });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw json({ error: 'Invalid data', issues: error.issues }, { status: 400 });
    }
    
    throw json({ error: 'Internal server error' }, { status: 500 });
  }
}