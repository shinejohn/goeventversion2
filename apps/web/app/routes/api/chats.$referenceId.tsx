import { ActionFunctionArgs } from 'react-router';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { createChatMessagesService } from '~/lib/chats/.server/chat-messages.service';
import { RenameChatSchema } from '~/lib/chats/schema/rename-chat.schema';
import { UpdateChatSchema } from '~/lib/chats/schema/update-chat.schema';
import { requireUserLoader } from '~/lib/require-user-loader';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireUserLoader(request);

  const client = getSupabaseServerClient(request);
  const service = createChatMessagesService(client);

  const method = request.method;
  const chatReferenceId = params.referenceId as string;

  switch (method) {
    case 'DELETE': {
      await service.deleteChat({
        chatReferenceId,
      });

      return {
        success: true,
      };
    }

    case 'PATCH': {
      const json = await request.json();
      const body = RenameChatSchema.parse(json);

      await service.updateChat({
        chatReferenceId,
        ...body,
      });

      return {
        success: true,
      };
    }

    case 'PUT': {
      const json = await request.json();
      const body = UpdateChatSchema.parse(json);

      await service.updateChat({
        chatReferenceId,
        ...body,
      });

      return {
        success: true,
      };
    }
  }
};
