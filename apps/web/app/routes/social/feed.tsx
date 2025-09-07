import React from 'react';
import SocialFeedPage from '~/components/magic-patterns/pages/social/SocialFeedPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/feed';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  try {
    // Load social feed items
    const { data: feedItems } = await client
      .from('social_posts')
      .select(`
        *,
        author:accounts(name, picture_url),
        event:events(title, image_url),
        likes:social_likes(count),
        comments:social_comments(count)
      `)
      .or(`author_id.in.(${user.id}),visibility.eq.public`)
      .order('created_at', { ascending: false })
      .limit(50);
    
    return {
      feedItems: feedItems || [],
      currentUserId: user.id
    };
  } catch (error) {
    console.error('Social feed loader error:', error);
    return { feedItems: [], currentUserId: user.id };
  }
};

export default function SocialFeedRoute({ loaderData }: Route.ComponentProps) {
  return <SocialFeedPage 
    feedItems={loaderData.feedItems}
    currentUserId={loaderData.currentUserId}
  />;
}