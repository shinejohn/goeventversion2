-- RPC function to get user conversations
CREATE OR REPLACE FUNCTION get_user_conversations(user_id UUID)
RETURNS TABLE (
  id TEXT,
  other_user JSONB,
  last_message JSONB,
  unread_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH conversation_messages AS (
    -- Get all messages for the user
    SELECT 
      m.*,
      CASE 
        WHEN m.sender_id = user_id THEN m.recipient_id 
        ELSE m.sender_id 
      END as other_user_id
    FROM messages m
    WHERE m.sender_id = user_id OR m.recipient_id = user_id
  ),
  latest_messages AS (
    -- Get the latest message for each conversation
    SELECT DISTINCT ON (other_user_id)
      other_user_id,
      id,
      content,
      created_at,
      sender_id,
      recipient_id,
      is_read
    FROM conversation_messages
    ORDER BY other_user_id, created_at DESC
  ),
  unread_counts AS (
    -- Count unread messages per conversation
    SELECT 
      other_user_id,
      COUNT(*) as unread_count
    FROM conversation_messages
    WHERE recipient_id = user_id AND is_read = false
    GROUP BY other_user_id
  )
  SELECT 
    'conv-' || lm.other_user_id as id,
    jsonb_build_object(
      'id', u.id,
      'name', u.raw_user_meta_data->>'name',
      'email', u.email,
      'picture_url', u.raw_user_meta_data->>'avatar_url'
    ) as other_user,
    jsonb_build_object(
      'id', lm.id,
      'content', lm.content,
      'created_at', lm.created_at,
      'sender_id', lm.sender_id,
      'is_read', lm.is_read
    ) as last_message,
    COALESCE(uc.unread_count, 0) as unread_count
  FROM latest_messages lm
  JOIN auth.users u ON u.id = lm.other_user_id
  LEFT JOIN unread_counts uc ON uc.other_user_id = lm.other_user_id
  ORDER BY lm.created_at DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_conversations(UUID) TO authenticated;

-- Function to get messages for a specific conversation
CREATE OR REPLACE FUNCTION get_conversation_messages(
  current_user_id UUID,
  other_user_id UUID,
  limit_count INT DEFAULT 50,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  sender_id UUID,
  recipient_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN,
  sender JSONB,
  recipient JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark messages as read
  UPDATE messages
  SET is_read = true
  WHERE recipient_id = current_user_id 
    AND sender_id = other_user_id 
    AND is_read = false;

  -- Return messages
  RETURN QUERY
  SELECT 
    m.id,
    m.content,
    m.sender_id,
    m.recipient_id,
    m.created_at,
    m.is_read,
    jsonb_build_object(
      'id', s.id,
      'name', s.raw_user_meta_data->>'name',
      'email', s.email,
      'picture_url', s.raw_user_meta_data->>'avatar_url'
    ) as sender,
    jsonb_build_object(
      'id', r.id,
      'name', r.raw_user_meta_data->>'name',
      'email', r.email,
      'picture_url', r.raw_user_meta_data->>'avatar_url'
    ) as recipient
  FROM messages m
  JOIN auth.users s ON s.id = m.sender_id
  JOIN auth.users r ON r.id = m.recipient_id
  WHERE 
    (m.sender_id = current_user_id AND m.recipient_id = other_user_id)
    OR (m.sender_id = other_user_id AND m.recipient_id = current_user_id)
  ORDER BY m.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_conversation_messages(UUID, UUID, INT, INT) TO authenticated;

-- Function to send a message
CREATE OR REPLACE FUNCTION send_message(
  from_user_id UUID,
  to_user_id UUID,
  message_content TEXT
)
RETURNS messages
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_message messages;
BEGIN
  -- Verify users exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = from_user_id) THEN
    RAISE EXCEPTION 'Sender does not exist';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = to_user_id) THEN
    RAISE EXCEPTION 'Recipient does not exist';
  END IF;

  -- Insert message
  INSERT INTO messages (sender_id, recipient_id, content)
  VALUES (from_user_id, to_user_id, message_content)
  RETURNING * INTO new_message;

  -- Create notification for recipient
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    to_user_id,
    'new_message',
    'New Message',
    'You have a new message',
    '/messages'
  );

  RETURN new_message;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION send_message(UUID, UUID, TEXT) TO authenticated;