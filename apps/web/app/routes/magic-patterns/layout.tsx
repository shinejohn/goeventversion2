import { Outlet } from 'react-router';

// Use Magic Patterns components directly for SSR
import { Header } from '~/components/magic-patterns/components/layout/Header';
import { Footer } from '~/components/magic-patterns/components/layout/Footer';

export default function MagicPatternsLayout() {
  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}