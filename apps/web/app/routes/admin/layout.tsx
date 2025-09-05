import React from 'react';
import { Outlet } from 'react-router';

import { Page, PageMobileNavigation, PageNavigation } from '@kit/ui/page';
import { SidebarProvider } from '@kit/ui/shadcn-sidebar';

import { AdminSidebar } from './_components/admin-sidebar';
import { AdminMobileNavigation } from './_components/mobile-navigation';

export const meta = () => [
  {
    title: `Super Admin`,
  },
];

export default function AdminLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Page style={'sidebar'}>
        <PageNavigation>
          <AdminSidebar />
        </PageNavigation>

        <PageMobileNavigation>
          <AdminMobileNavigation />
        </PageMobileNavigation>

        <Outlet />
      </Page>
    </SidebarProvider>
  );
}
