import { User } from '@supabase/supabase-js';

import { If } from '@kit/ui/if';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNavigation,
  SidebarProvider,
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

const minimized = personalAccountNavigationConfig.sidebarCollapsed;

type UserWorkspace = Route.ComponentProps['loaderData']['workspace'];

export function HomeSidebar(props: { workspace: UserWorkspace }) {
  const { workspace, user, accounts } = props.workspace;

  return (
    <SidebarProvider minimized={minimized}>
      <Sidebar>
        <SidebarHeader className={'h-16 justify-center'}>
          <div className={'flex items-center justify-between space-x-2'}>
            <If
              condition={featuresFlagConfig.enableTeamAccounts}
              fallback={
                <AppLogo
                  className={cn({
                    'max-w-full': minimized,
                    'py-2': !minimized,
                  })}
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
          <ProfileAccountDropdownContainer
            user={user as User}
            account={workspace}
          />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
