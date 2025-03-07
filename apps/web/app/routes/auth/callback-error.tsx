import { Link, redirect } from 'react-router';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';
import type { Route } from '~/types/app/routes/auth/+types/callback-error';

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const inviteToken = searchParams.get('invite_token');
  const error = searchParams.get('error');

  if (!error) {
    const queryParam = inviteToken ? `?invite_token=${inviteToken}` : '';

    throw redirect(pathsConfig.auth.signIn + queryParam);
  }

  return {
    error,
  };
};

export default function AuthCallbackErrorPage(props: Route.ComponentProps) {
  const { error } = props.loaderData;

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

      <Button asChild>
        <Link to={pathsConfig.auth.signIn}>
          <Trans i18nKey={'auth:signIn'} />
        </Link>
      </Button>
    </div>
  );
}
