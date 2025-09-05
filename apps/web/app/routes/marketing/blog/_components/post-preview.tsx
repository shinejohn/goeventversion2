import React from 'react';
import { Link } from 'react-router';

import { Cms } from '@kit/cms';
import { If } from '@kit/ui/if';

import { CoverImage } from '~/routes/marketing/blog/_components/cover-image';
import { DateFormatter } from '~/routes/marketing/blog/_components/date-formatter';

type Props = {
  post: Cms.ContentItem;
  imageHeight?: string | number;
};

const DEFAULT_IMAGE_HEIGHT = 250;

export function PostPreview({
  post,
  imageHeight,
}: React.PropsWithChildren<Props>) {
  const { title, image, publishedAt, description } = post;
  const height = imageHeight ?? DEFAULT_IMAGE_HEIGHT;

  const slug = `/blog/${post.slug}`;

  return (
    <div className="transition-shadow-sm flex flex-col gap-y-4 rounded-lg duration-500">
      <If condition={image}>
        {(imageUrl) => (
          <div className="relative mb-2 w-full" style={{ height }}>
            <Link to={slug}>
              <CoverImage
                className={'absolute h-full w-full'}
                title={title}
                src={imageUrl}
              />
            </Link>
          </div>
        )}
      </If>

      <div className={'flex flex-col space-y-4 px-1'}>
        <div className={'flex flex-col space-y-2'}>
          <h2 className="text-xl font-semibold leading-snug tracking-tight">
            <Link to={slug} className="hover:underline">
              {title}
            </Link>
          </h2>

          <div className="flex flex-row items-center gap-x-3 text-sm">
            <div className="text-muted-foreground">
              <DateFormatter dateString={publishedAt} />
            </div>
          </div>
        </div>

        <p
          className="text-muted-foreground mb-4 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description ?? '' }}
        />
      </div>
    </div>
  );
}
