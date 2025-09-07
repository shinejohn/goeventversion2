import React from 'react';
import { MessagesPage } from '~/components/magic-patterns/pages/social/MessagesPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/messages';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }
    
    // Fetch user's message threads
    const { data: messages, error } = await client
      .from('messages')
      .select(`
        id,
        thread_id,
        content,
        created_at,
        from_user_id,
        to_user_id,
        from_user:auth.users!messages_from_user_id_fkey(id, email),
        to_user:auth.users!messages_to_user_id_fkey(id, email)
      `)
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
    }
    
    // Group messages by thread
    const threads = messages?.reduce((acc, msg) => {
      if (!acc[msg.thread_id]) {
        acc[msg.thread_id] = {
          threadId: msg.thread_id,
          lastMessage: msg,
          messages: []
        };
      }
      acc[msg.thread_id].messages.push(msg);
      return acc;
    }, {} as Record<string, any>) || {};
    
    return {
      title: 'Messages - GoEventCity',
      conversations: Object.values(threads),
      currentUserId: user.id
    };
  } catch (error) {
    console.error('Messages loader error:', error);
    return {
      title: 'Messages - GoEventCity',
      conversations: [],
      currentUserId: null
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData
export default function MessagesRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <MessagesPage 
    conversations={data.conversations}
    currentUserId={data.currentUserId}
  />;
}
