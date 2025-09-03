import { Outlet } from 'react-router';

// Magic Patterns components
import { MainHeader } from '~/components/magic-patterns/components/layout/MainHeader';
import { Footer } from '~/components/magic-patterns/components/layout/Footer';

export default function MagicPatternsLayout() {
  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <MainHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}