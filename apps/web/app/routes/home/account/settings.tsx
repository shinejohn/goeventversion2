import { useRouteLoaderData } from 'react-router';

import { getI18n } from 'react-i18next';
import { z } from 'zod';

import { verifyCsrfToken } from '@kit/csrf/server';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import {
  deleteTeamAccountAction,
  leaveTeamAccountAction,
  updateTeamAccountName,
} from '@kit/team-accounts/actions';
import { TeamAccountSettingsContainer } from '@kit/team-accounts/components';
import {
  DeleteTeamAccountSchema,
  LeaveTeamAccountSchema,
  UpdateTeamNameSchema,
} from '@kit/team-accounts/schema';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route as AccountWorkspaceRoute } from '~/types/app/routes/home/account/+types/layout';
import type { Route } from '~/types/app/routes/home/account/+types/settings';

import { TeamAccountLayoutPageHeader } from './_components/team-account-layout-page-header';
import { LikedVenues } from '~/components/magic-patterns/components/profile/LikedVenues';
import { UserComments } from '~/components/magic-patterns/components/profile/UserComments';
import { AvatarUploader } from '~/components/magic-patterns/components/settings/AvatarUploader';
import { NotificationPreferences } from '~/components/magic-patterns/components/settings/NotificationPreferences';
import { PrivacySettings } from '~/components/magic-patterns/components/settings/PrivacySettings';
import { ProfileInformation } from '~/components/magic-patterns/components/settings/ProfileInformation';
import { SettingsSidebar } from '~/components/magic-patterns/components/settings/SettingsSidebar';
import { ProfileDropdown } from '~/components/magic-patterns/components/ui/ProfileDropdown';
import { VenueImageGallery } from '~/components/magic-patterns/components/venue-profile/VenueImageGallery';
import { VenueSpaceDetails } from '~/components/magic-patterns/components/venue-profile/VenueSpaceDetails';
import { TicketsPage } from '~/components/magic-patterns/pages/profile/TicketsPage';
import { UserProfilePage } from '~/components/magic-patterns/pages/profile/UserProfilePage';
import { UserProfileSettingsPage } from '~/components/magic-patterns/pages/profile/UserProfileSettingsPage';
import { AccountSettingsPage } from '~/components/magic-patterns/pages/settings/AccountSettingsPage';

const paths = {
  teamAccountSettings: pathsConfig.app.accountSettings,
};

const ActionSchema = z.union([
  LeaveTeamAccountSchema,
  DeleteTeamAccountSchema,
  UpdateTeamNameSchema,
]);

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const i18n = await createI18nServerInstance(args.request);
  const title = i18n.t('teams:settings.pageTitle');

  return {
    title,
  };
}

export async function clientLoader() {
  const i18n = getI18n();
  const title = i18n.t('teams:settings.pageTitle');

  return {
    title,
  };
}

export default function TeamAccountSettingsPage() {
  const data = useRouteLoaderData(
    'routes/home/account/layout',
  ) as AccountWorkspaceRoute.ComponentProps['loaderData'];

  const workspace = data.workspace;

  const account = {
    id: workspace.account.id,
    name: workspace.account.name,
    pictureUrl: workspace.account.picture_url,
    slug: workspace.account.slug,
    primaryOwnerUserId: workspace.account.primary_owner_user_id,
  };

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account.slug}
        title={<Trans i18nKey={'teams:settings.pageTitle'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <div className={'flex max-w-2xl flex-1 flex-col'}>
          <TeamAccountSettingsContainer
            account={account}
            paths={paths}
            features={{
              enableTeamDeletion: featureFlagsConfig.enableTeamDeletion,
            }}
          />
        </div>
      </PageBody>
    </>
  );
}

export const action = async (args: Route.ActionArgs) => {
  const json = await args.request.json();
  const data = ActionSchema.parse(json);

  await verifyCsrfToken(args.request, data.payload.csrfToken);

  const client = getSupabaseServerClient(args.request);

  switch (data.intent) {
    case 'leave-team':
      return leaveTeamAccountAction({
        data,
        client,
      });

    case 'update-team-name':
      return updateTeamAccountName({
        client,
        data,
      });

    case 'delete-team-account':
      return deleteTeamAccountAction({
        data,
        client,
      });
  }
};
