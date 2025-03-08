import { redirect, redirectDocument } from 'react-router';

import { SupabaseClient } from '@supabase/supabase-js';

import { z } from 'zod';

import { createOtpApi } from '@kit/otp';
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
  const otpApi = createOtpApi(params.client);

  const otpResult = await otpApi.verifyToken({
    purpose: `delete-team-account-${accountId}`,
    userId,
    token: payload.otp,
  });

  if (!otpResult.valid) {
    throw new Error('Invalid OTP code');
  }

  if (otpResult.user_id !== userId) {
    throw new Error('Nonce User ID mismatch');
  }

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
