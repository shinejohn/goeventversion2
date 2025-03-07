'use client';

import { useNavigate, useSearchParams } from 'react-router';

import type { Provider } from '@supabase/supabase-js';

import { isBrowser } from '@kit/shared/utils';
import { If } from '@kit/ui/if';
import { Separator } from '@kit/ui/separator';
import { Trans } from '@kit/ui/trans';

import { MagicLinkAuthContainer } from './magic-link-auth-container';
import { OauthProviders } from './oauth-providers';
import { PasswordSignInContainer } from './password-sign-in-container';

export function SignInMethodsContainer(props: {
  inviteToken?: string;

  paths: {
    callback: string;
    home: string;
    joinTeam: string;
  };

  providers: {
    password: boolean;
    magicLink: boolean;
    oAuth: Provider[];
  };
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const nextPath = params.get('next') ?? props.paths.home;

  const redirectUrl = isBrowser()
    ? new URL(props.paths.callback, window?.location.origin).toString()
    : '';

  const onSignIn = () => {
    if (props.inviteToken) {
      const searchParams = new URLSearchParams({
        invite_token: props.inviteToken,
      });

      const joinTeamPath = props.paths.joinTeam + '?' + searchParams.toString();

      return navigate(joinTeamPath, { replace: true });
    } else {
      return navigate(nextPath, { replace: true });
    }
  };

  return (
    <>
      <If condition={props.providers.password}>
        <PasswordSignInContainer onSignIn={onSignIn} />
      </If>

      <If condition={props.providers.magicLink}>
        <MagicLinkAuthContainer
          shouldCreateUser={false}
          inviteToken={props.inviteToken}
          redirectUrl={redirectUrl}
        />
      </If>

      <If condition={props.providers.oAuth.length}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              <Trans i18nKey="auth:orContinueWith" />
            </span>
          </div>
        </div>

        <OauthProviders
          enabledProviders={props.providers.oAuth}
          inviteToken={props.inviteToken}
          shouldCreateUser={false}
          paths={{
            callback: props.paths.callback,
            returnPath: props.paths.home,
          }}
        />
      </If>
    </>
  );
}
