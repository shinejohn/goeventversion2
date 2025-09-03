import { Outlet } from 'react-router';

// Simple, working components
import { SimpleHeader } from '~/components/magic-patterns/components/layout/SimpleHeader';
import { SimpleFooter } from '~/components/magic-patterns/components/layout/SimpleFooter';

export default function MagicPatternsLayout() {
  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <SimpleHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SimpleFooter />
    </div>
  );
}