import React from 'react';
import { JwtPayload } from '@supabase/supabase-js';

import { Header } from '@kit/ui/marketing';

import { AppLogo } from '~/components/app-logo';

import { SiteHeaderAccountSection } from './site-header-account-section';
import { SiteNavigation } from './site-navigation';

export function SiteHeader({ user }: { user: JwtPayload | null }) {
  return (
    <Header
      logo={<AppLogo />}
      navigation={<SiteNavigation />}
      actions={<SiteHeaderAccountSection user={user} />}
    />
  );
}
