import React from 'react';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { SitePageHeader } from '~/routes/marketing/_components/site-page-header';
import type { Route } from './+types/marketing/terms-of-service';

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export const loader = async function ({ request }: Route.LoaderArgs) {
  const { t } = await createI18nServerInstance(request);

  return {
    title: t('marketing:termsOfService'),
    subtitle: t('marketing:termsOfServiceDescription'),
  };
};

export default function TermsAndConditionsPage(props: Route.ComponentProps) {
  const data = props.loaderData;

  return (
    <div>
      <SitePageHeader title={data.title} subtitle={data.subtitle} />

      <div className={'container mx-auto py-8'}>
        <div>Your content here</div>
      </div>
    </div>
  );
}
