import type { User } from '@supabase/supabase-js';

import { createAccountsApi } from '@kit/accounts/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import featureFlagsConfig from '~/config/feature-flags.config';
import { requireUserLoader } from '~/lib/require-user-loader';

const shouldLoadAccounts = featureFlagsConfig.enableTeamAccounts;

export type UserWorkspace = Awaited<ReturnType<typeof loadUserWorkspace>> & {
  user: User;
};

/**
 * @name loadUserWorkspace
 * @description
 * Load the user workspace data. It's a cached per-request function that fetches the user workspace data.
 * It can be used across the server components to load the user workspace data.
 */
export const loadUserWorkspace = async (request: Request) => {
  const client = getSupabaseServerClient(request);
  const api = createAccountsApi(client);

  const accountsPromise = shouldLoadAccounts
    ? () => api.loadUserAccounts()
    : () => Promise.resolve([]);

  const workspacePromise = api.getAccountWorkspace();
  const userPromise = requireUserLoader(request);

  const [accounts, workspace, user] = await Promise.all([
    accountsPromise(),
    workspacePromise,
    userPromise,
  ]);

  return {
    accounts,
    workspace,
    user,
  };
};
