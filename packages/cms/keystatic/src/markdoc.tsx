import React from 'react';

import type { Node } from '@markdoc/markdoc';
import markdoc from '@markdoc/markdoc';

import {
  CustomMarkdocComponents,
  CustomMarkdocTags,
} from './custom-components';
import { MarkdocNodes } from './markdoc-nodes';

/**
 * @name renderMarkdoc
 * @description Renders a Markdoc tree to React
 */
export async function renderMarkdoc(node: Node) {
  const content = markdoc.transform(node, {
    tags: {
      ...CustomMarkdocTags,
    },
    nodes: {
      ...MarkdocNodes,
    },
  });

  return markdoc.renderers.react(content, React, {
    components: CustomMarkdocComponents as Record<string, React.ComponentType>,
  });
}
