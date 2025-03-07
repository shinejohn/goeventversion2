import type { CmsType } from '@kit/cms-types';
import { KeystaticContentRenderer } from '@kit/keystatic/renderer';
import { WordpressContentRenderer } from '@kit/wordpress/renderer';

const CMS_CLIENT = import.meta.env.VITE_CMS_CLIENT as CmsType;

interface ContentRendererProps {
  content: unknown;
  type?: CmsType;
}

export function ContentRenderer({
  content,
  type = CMS_CLIENT,
}: ContentRendererProps) {
  switch (type) {
    case 'keystatic':
      return <KeystaticContentRenderer content={content} />;

    case 'wordpress':
      return <WordpressContentRenderer content={content} />;

    default:
      return null;
  }
}
