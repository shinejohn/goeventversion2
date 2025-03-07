import { If } from '@kit/ui/if';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNavigation,
} from '@kit/ui/shadcn-sidebar';
import { cn } from '@kit/ui/utils';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import featuresFlagConfig from '~/config/feature-flags.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { UserNotifications } from '~/routes/home/user/_components/user-notifications';
import { Route } from '~/types/app/routes/home/user/+types/layout';

// home imports
import { HomeAccountSelector } from './home-account-selector';

type UserWorkspace = Route.ComponentProps['loaderData']['workspace'];

export function HomeSidebar(props: { workspace: UserWorkspace }) {
  const { workspace, user, accounts } = props.workspace;
  const collapsible = personalAccountNavigationConfig.sidebarCollapsedStyle;

  return (
    <Sidebar collapsible={collapsible}>
      <SidebarHeader className={'h-16 justify-center'}>
        <div className={'flex items-center justify-between gap-x-3'}>
          <If
            condition={featuresFlagConfig.enableTeamAccounts}
            fallback={
              <AppLogo
                className={cn(
                  'p-2 group-data-[minimized=true]:max-w-full group-data-[minimized=true]:py-0',
                )}
              />
            }
          >
            <HomeAccountSelector userId={user.id} accounts={accounts} />
          </If>

          <div className={'group-data-[minimized=true]:hidden'}>
            <UserNotifications userId={user.id} />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavigation config={personalAccountNavigationConfig} />
      </SidebarContent>

      <SidebarFooter>
        <ProfileAccountDropdownContainer user={user} account={workspace} />
      </SidebarFooter>
    </Sidebar>
  );
}
