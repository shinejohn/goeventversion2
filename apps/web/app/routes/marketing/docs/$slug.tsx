import React from 'react';
import { data, redirect } from 'react-router';

import { Cms } from '@kit/cms';
import { createCmsClient } from '@kit/cms/server';
import { ContentRenderer } from '@kit/cms/client';
import { If } from '@kit/ui/if';
import { Separator } from '@kit/ui/separator';

import { SitePageHeader } from '~/routes/marketing/_components/site-page-header';
import type { Route } from './+types/docs/$slug';

import { DocsCards } from './_components/docs-cards';

const getPageBySlug = async (slug: string) => {
  const client = await createCmsClient();

  return client.getContentItemBySlug({ slug, collection: 'documentation' });
};

export const meta = (args: Route.MetaArgs) => {
  if (!args.data) {
    return [];
  }

  const { title, description } = args.data.page;

  return [
    {
      title,
      description,
    },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const page = await getPageBySlug(params['*'] as string);

  if (!page) {
    throw redirect('/404');
  }

  return data({
    page,
  });
};

export default function DocumentationPage(props: Route.ComponentProps) {
  const { page } = props.loaderData;
  const description = page?.description ?? '';

  return (
    <div className={'flex flex-1 flex-col'}>
      <SitePageHeader
        className={'lg:px-8'}
        container={false}
        title={page.title}
        subtitle={description}
      />

      <div className={'flex flex-col space-y-4 py-6 lg:px-8'}>
        <article className={'markdoc'}>
          <ContentRenderer content={page.content} />
        </article>

        <If condition={page.children.length > 0}>
          <Separator />

          <DocsCards cards={(page.children ?? []) as Cms.ContentItem[]} />
        </If>
      </div>
    </div>
  );
}
