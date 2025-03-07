import { redirect, redirectDocument } from 'react-router';

import { SupabaseClient } from '@supabase/supabase-js';

import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { requireUser } from '@kit/supabase/require-user';

import { DeleteTeamAccountSchema } from '../../schema';
import { createDeleteTeamAccountService } from '../services/delete-team-account.service';

export const deleteTeamAccountAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof DeleteTeamAccountSchema>;
}) => {
  const { payload } = DeleteTeamAccountSchema.parse(params.data);
  const accountId = payload.accountId;
  const auth = await requireUser(params.client);

  if (!auth.data) {
    return redirect(auth.redirectTo);
  }

  const userId = auth.data.id;

  await deleteTeamAccount(params.client, {
    accountId,
    userId,
  });

  return redirectDocument('/home');
};

async function deleteTeamAccount(
  client: SupabaseClient<Database>,
  params: {
    accountId: string;
    userId: string;
  },
) {
  const service = createDeleteTeamAccountService();

  // verify that the user has the necessary permissions to delete the team account
  await assertUserPermissionsToDeleteTeamAccount(client, params);

  // delete the team account
  await service.deleteTeamAccount(client, params);
}

async function assertUserPermissionsToDeleteTeamAccount(
  client: SupabaseClient<Database>,
  params: {
    accountId: string;
    userId: string;
  },
) {
  const { data, error } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', params.userId)
    .eq('is_personal_account', false)
    .eq('id', params.accountId)
    .single();

  if (error ?? !data) {
    throw new Error('Account not found');
  }
}
