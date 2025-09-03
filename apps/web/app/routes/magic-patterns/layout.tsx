import { Outlet } from 'react-router';
import { ClientOnly } from '@kit/ui/client-only';

// Try Magic Patterns components with ClientOnly wrapper
import { Header } from '~/components/magic-patterns/components/layout/Header';
import { Footer } from '~/components/magic-patterns/components/layout/Footer';
// Fallback components
import { SimpleHeader } from '~/components/magic-patterns/components/layout/SimpleHeader';
import { SimpleFooter } from '~/components/magic-patterns/components/layout/SimpleFooter';

export default function MagicPatternsLayout() {
  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <ClientOnly fallback={<SimpleHeader />}>
        <Header />
      </ClientOnly>
      <main className="flex-1">
        <Outlet />
      </main>
      <ClientOnly fallback={<SimpleFooter />}>
        <Footer />
      </ClientOnly>
    </div>
  );
}