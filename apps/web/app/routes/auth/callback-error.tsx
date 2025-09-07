import React from 'react';
import { Link, redirect } from 'react-router';

import { AuthError } from '@supabase/supabase-js';

import { ResendAuthLinkForm } from '@kit/auth/resend-email-link';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';
import type { Route } from './+types/auth/callback-error';

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const inviteToken = searchParams.get('invite_token');
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  const callback = searchParams.get('callback');

  const signInPath = pathsConfig.auth.signIn;
  const redirectPath = callback ?? pathsConfig.auth.callback;

  if (!error) {
    const queryParam = inviteToken ? `?invite_token=${inviteToken}` : '';

    throw redirect(pathsConfig.auth.signIn + queryParam);
  }

  return {
    error,
    signInPath,
    redirectPath,
    code,
  };
};

export default function AuthCallbackErrorPage(props: Route.ComponentProps) {
  const { error, signInPath, redirectPath, code } = props.loaderData;

  return (
    <div className={'flex flex-col space-y-4 py-4'}>
      <div>
        <Alert variant={'destructive'}>
          <AlertTitle>
            <Trans i18nKey={'auth:authenticationErrorAlertHeading'} />
          </AlertTitle>

          <AlertDescription>
            <Trans i18nKey={error} />
          </AlertDescription>
        </Alert>
      </div>

      <AuthCallbackForm
        code={code ?? undefined}
        signInPath={signInPath}
        redirectPath={redirectPath}
      />
    </div>
  );
}

function AuthCallbackForm(props: {
  signInPath: string;
  redirectPath?: string;
  code?: AuthError['code'];
}) {
  switch (props.code) {
    case 'otp_expired':
      return <ResendAuthLinkForm redirectPath={props.redirectPath} />;
    default:
      return <SignInButton signInPath={props.signInPath} />;
  }
}

function SignInButton(props: { signInPath: string }) {
  return (
    <Button className={'w-full'} asChild>
      <Link to={props.signInPath}>
        <Trans i18nKey={'auth:signIn'} />
      </Link>
    </Button>
  );
}
