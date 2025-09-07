import React from 'react';
import { redirect } from 'react-router';

import { Cms, createCmsClient } from '@kit/cms';

import type { Route } from './+types/blog/$slug';

import { Post } from './_components/post';

export const loader = async (args: Route.LoaderArgs) => {
  const client = await createCmsClient();
  const slug = args.params.slug as string;

  const post = await client.getContentItemBySlug({ slug, collection: 'posts' });

  if (!post) {
    throw redirect('/404');
  }

  return {
    post,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data?.post) {
    return [{}];
  }

  const { title, description } = data.post;

  return [{ title }, { description }];
};

export default function BlogPost(props: Route.ComponentProps) {
  const { post } = props.loaderData;

  return (
    <div className={'container sm:max-w-none sm:p-0'}>
      <Post post={post as Cms.ContentItem} content={post.content} />
    </div>
  );
}
