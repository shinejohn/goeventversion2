import { redirect } from 'react-router';

import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

import { isSuperAdmin } from './is-super-admin';

/**
 * @name getSuperAdminUser
 * @description Check if the current user is a super admin and return the user.
 * @param client
 */
export async function getSuperAdminUser(client: SupabaseClient<Database>) {
  const isAuthedUserSuperAdmin = await isSuperAdmin(client);

  if (!isAuthedUserSuperAdmin) {
    throw redirect('/404');
  }

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw redirectToSignIn();
  }

  if (!data.user) {
    throw redirectToSignIn();
  }

  return data.user;
}

function redirectToSignIn() {
  return redirect('/auth/sign-in');
}
