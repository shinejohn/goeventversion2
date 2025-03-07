import { useMemo } from 'react';

import { useRouteLoaderData } from 'react-router';

import { PlusCircle } from 'lucide-react';
import { z } from 'zod';

import { verifyCsrfToken } from '@kit/csrf/server';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import {
  AccountInvitationsTable,
  AccountMembersTable,
  InviteMembersDialogContainer,
} from '@kit/team-accounts/components';
import {
  DeleteInvitationSchema,
  InviteMembersSchema,
  RemoveMemberSchema,
  RenewInvitationSchema,
  TransferOwnershipSchema,
  UpdateInvitationSchema,
  UpdateMemberRoleSchema,
} from '@kit/team-accounts/schema';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { requireUserLoader } from '~/lib/require-user-loader';
import { TeamAccountLayoutPageHeader } from '~/routes/home/account/_components/team-account-layout-page-header';
import type { Route } from '~/types/app/routes/home/account/+types/members';
import type { Route as AccountWorkspaceRoute } from '~/types/app/routes/home/account/+types/layout';

import { loadMembersPageData } from './_lib/members-page-loader.server';

const MembersActionsSchema = z.union([
  InviteMembersSchema,
  RenewInvitationSchema,
  UpdateMemberRoleSchema,
  DeleteInvitationSchema,
  UpdateInvitationSchema,
  RemoveMemberSchema,
  TransferOwnershipSchema,
]);

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // require user
  await requireUserLoader(args.request);

  const client = getSupabaseServerClient(args.request);
  const i18n = await createI18nServerInstance(args.request);
  const title = i18n.t('teams:members.pageTitle');

  const accountSlug = args.params.account as string;

  const [members, invitations, user, canAddMember] = await loadMembersPageData(
    client,
    accountSlug,
  );

  return {
    title,
    accountSlug,
    members,
    invitations,
    user,
    canAddMember,
  };
}

export default function TeamAccountMembersPage(props: Route.ComponentProps) {
  const data = props.loaderData;

  const { workspace } = useRouteLoaderData(
    'routes/home/account/layout',
  ) as AccountWorkspaceRoute.ComponentProps['loaderData'];

  const account = workspace.account;

  const canManageRoles = account.permissions.includes('roles.manage');
  const canManageInvitations = account.permissions.includes('invites.manage');

  const isPrimaryOwner = account.primary_owner_user_id === data.user.id;
  const currentUserRoleHierarchy = account.role_hierarchy_level;

  const permissions = useMemo(() => {
    return {
      canUpdateInvitation: canManageRoles,
      canRemoveInvitation: canManageRoles,
      currentUserRoleHierarchy,
    };
  }, [canManageRoles, currentUserRoleHierarchy]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        title={<Trans i18nKey={'common:membersTabLabel'} />}
        description={<AppBreadcrumbs />}
        account={data.accountSlug}
      />

      <PageBody>
        <div className={'flex w-full max-w-4xl flex-col space-y-6 pb-32'}>
          <Card>
            <CardHeader className={'flex flex-row justify-between'}>
              <div className={'flex flex-col space-y-1.5'}>
                <CardTitle>
                  <Trans i18nKey={'common:accountMembers'} />
                </CardTitle>

                <CardDescription>
                  <Trans i18nKey={'common:membersTabDescription'} />
                </CardDescription>
              </div>

              <If condition={canManageInvitations && data.canAddMember}>
                <InviteMembersDialogContainer
                  userRoleHierarchy={currentUserRoleHierarchy}
                  accountSlug={data.accountSlug}
                >
                  <Button size={'sm'} data-test={'invite-members-form-trigger'}>
                    <PlusCircle className={'mr-2 w-4'} />

                    <span>
                      <Trans i18nKey={'teams:inviteMembersButton'} />
                    </span>
                  </Button>
                </InviteMembersDialogContainer>
              </If>
            </CardHeader>

            <CardContent>
              <AccountMembersTable
                userRoleHierarchy={currentUserRoleHierarchy}
                currentUserId={data.user.id}
                currentAccountId={account.id}
                members={data.members}
                isPrimaryOwner={isPrimaryOwner}
                canManageRoles={canManageRoles}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={'flex flex-row justify-between'}>
              <div className={'flex flex-col space-y-1.5'}>
                <CardTitle>
                  <Trans i18nKey={'teams:pendingInvitesHeading'} />
                </CardTitle>

                <CardDescription>
                  <Trans i18nKey={'teams:pendingInvitesDescription'} />
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <AccountInvitationsTable
                permissions={permissions}
                invitations={data.invitations}
              />
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

export const action = async function (args: Route.ActionArgs) {
  const client = getSupabaseServerClient(args.request);
  const json = await args.request.json();
  const data = await MembersActionsSchema.parseAsync(json);

  await verifyCsrfToken(args.request, data.payload.csrfToken);

  switch (data.intent) {
    case 'create-invitations': {
      const { createInvitationsAction } = await import(
        '@kit/team-accounts/actions'
      );

      return createInvitationsAction({ client, data });
    }

    case 'update-member-role': {
      const { updateMemberRoleAction } = await import(
        '@kit/team-accounts/actions'
      );

      return updateMemberRoleAction({
        client,
        data,
      });
    }

    case 'renew-invitation': {
      const { renewInvitationAction } = await import(
        '@kit/team-accounts/actions'
      );

      return renewInvitationAction({
        client,
        data,
      });
    }

    case 'delete-invitation': {
      const { deleteInvitationAction } = await import(
        '@kit/team-accounts/actions'
      );

      return deleteInvitationAction({
        client,
        data,
      });
    }

    case 'update-invitation': {
      const { updateInvitationAction } = await import(
        '@kit/team-accounts/actions'
      );

      return updateInvitationAction({
        client,
        data,
      });
    }

    case 'remove-member': {
      const { removeMemberFromAccountAction } = await import(
        '@kit/team-accounts/actions'
      );

      return removeMemberFromAccountAction({
        client,
        data,
      });
    }

    case 'transfer-ownership': {
      const { transferOwnershipAction } = await import(
        '@kit/team-accounts/actions'
      );

      return transferOwnershipAction({
        client,
        data,
      });
    }
  }
};
