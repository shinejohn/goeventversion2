import { User } from '@supabase/supabase-js';

import { z } from 'zod';

import { getSuperAdminUser } from '@kit/admin';
import {
  banUserAction,
  deleteAccountAction,
  deleteUserAction,
  impersonateUserAction,
  reactivateUserAction,
} from '@kit/admin/actions';
import { loadAdminAccountPage } from '@kit/admin/api';
import { AdminPersonalAccountPage } from '@kit/admin/components/admin-personal-account-page';
import { AdminTeamAccountPage } from '@kit/admin/components/admin-team-account-page';
import {
  BanUserSchema,
  DeleteAccountSchema,
  DeleteUserSchema,
  ImpersonateUserSchema,
  ReactivateUserSchema,
} from '@kit/admin/schema';
import { verifyCsrfToken } from '@kit/csrf/server';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';

import type { Route } from '~/types/app/routes/admin/accounts/+types/$account';

export const meta = () => [
  {
    title: 'Admin | Account',
  },
];

export const loader = async function (args: Route.LoaderArgs) {
  const client = getSupabaseServerClient(args.request);

  // admin protected route
  await getSuperAdminUser(client);

  const account = args.params.account as string;

  return loadAdminAccountPage(account);
};

export default function AdminPage(props: Route.ComponentProps) {
  const data = props.loaderData;

  return data.is_personal_account ? (
    <PageBody className={'py-4'}>
      <AdminPersonalAccountPage
        user={data.user as User}
        account={{
          picture_url: data.account.picture_url ?? '',
          name: data.account.name ?? '',
          id: data.account.id ?? '',
          email: data.account.email ?? '',
        }}
        memberships={data.memberships}
        subscription={data.subscription}
      />
    </PageBody>
  ) : (
    <PageBody className={'py-4'}>
      <AdminTeamAccountPage
        account={data.account}
        subscription={data.subscription}
        members={data.members}
      />
    </PageBody>
  );
}

const AdminAccountActions = z.union([
  BanUserSchema,
  ImpersonateUserSchema,
  DeleteAccountSchema,
  ReactivateUserSchema,
  DeleteUserSchema,
]);

export const action = async function (args: Route.ActionArgs) {
  const json = await args.request.json();
  const data = AdminAccountActions.parse(json);

  // verify CSRF token
  await verifyCsrfToken(args.request, data.payload.csrfToken);

  const client = getSupabaseServerClient(args.request);

  // admin protected route
  await getSuperAdminUser(client);

  switch (data.intent) {
    case 'ban-user':
      return banUserAction({ data, client });
    case 'impersonate-user':
      return impersonateUserAction({ data, client });
    case 'delete-team-account':
      return deleteAccountAction(data);
    case 'delete-user':
      return deleteUserAction({ data, client });
    case 'reactivate-user':
      return reactivateUserAction({ data, client });
    default:
      throw new Error('Invalid intent');
  }
};
