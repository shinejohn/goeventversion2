import { json, type LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { MessagesPage } from '~/components/magic-patterns/pages/social/MessagesPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';

interface Conversation {
  id: string;
  other_user: {
    id: string;
    name: string | null;
    email: string;
    picture_url: string | null;
  };
  last_message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    is_read: boolean;
  } | null;
  unread_count: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ conversations: [], messages: [] });
    }

    // Fetch all conversations (messages grouped by sender/recipient)
    // This query gets the latest message with each unique user
    const { data: conversations, error: conversationsError } = await client
      .rpc('get_user_conversations', { user_id: user.id });

    if (conversationsError) {
      logger.error({ error: conversationsError }, 'Error fetching conversations');
      // Fall back to simpler query
      const { data: messages } = await client
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          recipient_id,
          is_read,
          sender:auth.users!messages_sender_id_fkey(id, email, raw_user_meta_data),
          recipient:auth.users!messages_recipient_id_fkey(id, email, raw_user_meta_data)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(100);

      // Transform messages into conversations
      const conversationMap = new Map<string, Conversation>();
      
      messages?.forEach(message => {
        const otherId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        const otherUser = message.sender_id === user.id ? message.recipient : message.sender;
        
        if (!conversationMap.has(otherId) && otherUser) {
          conversationMap.set(otherId, {
            id: `conv-${otherId}`,
            other_user: {
              id: otherId,
              name: otherUser.raw_user_meta_data?.name || null,
              email: otherUser.email,
              picture_url: otherUser.raw_user_meta_data?.avatar_url || null
            },
            last_message: {
              id: message.id,
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id,
              is_read: message.is_read
            },
            unread_count: !message.is_read && message.recipient_id === user.id ? 1 : 0
          });
        }
      });

      return json({ 
        conversations: Array.from(conversationMap.values()),
        messages: messages || []
      });
    }

    return json({ 
      conversations: conversations || [],
      messages: []
    });

  } catch (error) {
    logger.error({ error }, 'Error loading messages');
    return json({ conversations: [], messages: [] });
  }
}

export default function MessagesRoute() {
  const { conversations, messages } = useLoaderData<typeof loader>();
  
  // Transform data to match MessagesPage expectations
  const transformedConversations = conversations.map(conv => ({
    id: conv.id,
    participants: [{
      id: conv.other_user.id,
      name: conv.other_user.name || conv.other_user.email.split('@')[0],
      avatar: conv.other_user.picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.other_user.email}`,
      online: false // We don't track online status yet
    }],
    lastMessage: conv.last_message ? {
      text: conv.last_message.content,
      timestamp: conv.last_message.created_at,
      read: conv.last_message.is_read,
      sender: conv.last_message.sender_id
    } : undefined,
    unread: conv.unread_count
  }));

  return <MessagesPage conversations={transformedConversations} />;
}