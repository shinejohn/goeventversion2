import React from 'react';
// apps/web/app/routes/social/index.tsx  
import type { Route } from '~/types/app/routes/social/index/+types';
import SocialFeedPage from '~/components/magic-patterns/pages/social/SocialFeedPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: posts, error } = await client
      .from('social_posts')
      .select(`
        *,
        author:auth.users(name, avatar_url),
        likes:post_likes(count),
        comments:post_comments(
          content,
          author:auth.users(name, avatar_url)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    return { posts: posts || [] };
    
  } catch (error) {
    console.error('Error loading social feed:', error);
    return { posts: [] };
  }
};

export default function SocialRoute({ loaderData }: Route.ComponentProps) {
  return <SocialFeedPage posts={loaderData.posts} />;
}