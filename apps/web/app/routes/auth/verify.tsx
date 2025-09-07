import React from 'react';
import { redirect } from 'react-router';

import { MultiFactorChallengeContainer } from '@kit/auth/mfa';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route } from './+types/auth/verify';
import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);

  const {
    data,
    error,
  } = await client.auth.getClaims();

  if (error || !data?.claims) {
    throw redirect(pathsConfig.auth.signIn);
  }

  const needsMfa = await checkRequiresMultiFactorAuthentication(client);

  if (!needsMfa) {
    throw redirect(pathsConfig.auth.signIn);
  }

  const i18n = await createI18nServerInstance(request);
  const searchParams = new URL(request.url).searchParams;
  const redirectPath = searchParams.get('next') ?? pathsConfig.app.home;

  return {
    title: i18n.t('auth:signIn'),
    redirectPath,
    userId: data.claims.sub,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export default function VerifyPage(props: Route.ComponentProps) {
  const { redirectPath, userId } = props.loaderData;

  return (
    <MultiFactorChallengeContainer
      userId={userId}
      paths={{
        redirectPath,
      }}
    />
  );
}
