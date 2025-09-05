import React from 'react';
import { Outlet } from 'react-router';

import { AuthLayoutShell } from '@kit/auth/shared';

import { AppLogo } from '../../../components/app-logo';

export default function AuthLayout() {
  return (
    <AuthLayoutShell Logo={AppLogo}>
      <Outlet />
    </AuthLayoutShell>
  );
}
