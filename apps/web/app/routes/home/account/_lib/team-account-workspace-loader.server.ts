import { SupabaseClient } from '@supabase/supabase-js';

import { createTeamAccountsApi } from '@kit/team-accounts/api';
import { Database } from '~/lib/database.types';

export const loadTeamWorkspace = async (params: {
  accountSlug: string;
  client: SupabaseClient<Database>;
}) => {
  const api = createTeamAccountsApi(params.client);

  const workspace = await api.getAccountWorkspace(params.accountSlug);

  if (workspace.error) {
    throw workspace.error;
  }

  return workspace.data;
};
