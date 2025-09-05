import React from 'react';
;

import { BookPerformerPage } from '~/components/magic-patterns/pages/book/BookPerformerPage';
import { PerformerGrid } from '~/components/magic-patterns/components/performers/PerformerGrid';
import { PerformerList } from '~/components/magic-patterns/components/performers/PerformerList';
import { LikedPerformers } from '~/components/magic-patterns/components/profile/LikedPerformers';
import { mockPerformers } from '~/components/magic-patterns/mockdata/performers';
import { PerformerToolsPage } from '~/components/magic-patterns/pages/PerformerToolsPage';
import { PerformersPage } from '~/components/magic-patterns/pages/PerformersPage';
import { performers } from '~/components/magic-patterns/pages/hub/[slug]/performers';
import { PerformerDiscoveryPage } from '~/components/magic-patterns/pages/performers/PerformerDiscoveryPage';
import { PerformerManagementPage } from '~/components/magic-patterns/pages/performers/PerformerManagementPage';
import { PerformerOnboardingPage } from '~/components/magic-patterns/pages/performers/PerformerOnboardingPage';
import { PerformerProfilePage } from '~/components/magic-patterns/pages/performers/PerformerProfilePage';

export default function BookPerformerRoute() {
  return <BookPerformerPage />;
}