import React from 'react';
import { UpdatePasswordForm } from '@kit/auth/password-reset';
import { AuthLayoutShell } from '@kit/auth/shared';

import { AppLogo } from '../../components/app-logo';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route } from '~/types/app/routes/+types/update-password';

export const loader = async (args: Route.LoaderArgs) => {
  const { t } = await createI18nServerInstance(args.request);

  return {
    title: t('auth:updatePassword'),
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};

const Logo = () => <AppLogo href={''} />;

export default function UpdatePasswordPage() {
  return (
    <AuthLayoutShell Logo={Logo}>
      <UpdatePasswordForm redirectTo={pathsConfig.app.home} />
    </AuthLayoutShell>
  );
}
