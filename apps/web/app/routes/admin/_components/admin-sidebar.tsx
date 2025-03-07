import { NavLink, useLocation } from 'react-router';

import { LayoutDashboard, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
} from '@kit/ui/shadcn-sidebar';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';

export function AdminSidebar() {
  const currentPath = useLocation().pathname;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className={'m-2'}>
          <AppLogo href={'/admin'} />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuButton isActive={currentPath === '/admin'} asChild>
                  <NavLink className={'flex gap-2.5'} to={'/admin'}>
                    <LayoutDashboard className={'h-4'} />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>

                <SidebarMenuButton
                  isActive={currentPath.startsWith('/admin/accounts')}
                  asChild
                >
                  <NavLink
                    className={'flex size-full gap-2.5'}
                    to={'/admin/accounts'}
                  >
                    <Users className={'h-4'} />
                    <span>Accounts</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <ProfileAccountDropdownContainer />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
