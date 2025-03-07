import { useContext } from 'react';

import { useNavigate } from 'react-router';

import { AccountSelector } from '@kit/accounts/account-selector';
import { SidebarContext } from '@kit/ui/shadcn-sidebar';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const features = {
  enableTeamCreation: featureFlagsConfig.enableTeamCreation,
};

export function HomeAccountSelector(props: {
  userId: string;

  accounts: Array<{
    label: string | null;
    value: string | null;
    image: string | null;
  }>;
}) {
  const navigate = useNavigate();
  const context = useContext(SidebarContext);

  return (
    <AccountSelector
      userId={props.userId}
      collapsed={context?.minimized}
      accounts={props.accounts}
      features={features}
      onAccountChange={(value) => {
        if (value) {
          const path = pathsConfig.app.accountHome.replace('[account]', value);

          navigate(path, {
            replace: true,
          });
        }
      }}
    />
  );
}
