import React from 'react';
'use client';

import { useLocation } from 'react-router';

import { Cms } from '@kit/cms';
import { Collapsible } from '@kit/ui/collapsible';
import { isRouteActive } from '@kit/ui/utils';

export function DocsNavigationCollapsible(
  props: React.PropsWithChildren<{
    node: Cms.ContentItem;
    prefix: string;
  }>,
) {
  const currentPath = useLocation().pathname;
  const prefix = props.prefix;

  const isChildActive = props.node.children.some((child) =>
    isRouteActive(prefix + '/' + child.url, currentPath, false),
  );

  return (
    <Collapsible
      className={'group/collapsible'}
      defaultOpen={isChildActive ? true : !props.node.collapsed}
    >
      {props.children}
    </Collapsible>
  );
}
