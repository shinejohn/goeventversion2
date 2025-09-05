import React from 'react';
import { PageHeader } from '@kit/ui/page';
import { Header } from '~/components/magic-patterns/components/layout/Header';

export function TeamAccountLayoutPageHeader(
  props: React.PropsWithChildren<{
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    account: string;
  }>,
) {
  return (
    <PageHeader description={props.description}>{props.children}</PageHeader>
  );
}
