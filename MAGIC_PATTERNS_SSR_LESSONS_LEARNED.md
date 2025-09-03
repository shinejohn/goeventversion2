# Magic Patterns → Makerkit SSR Integration: Lessons Learned

## Critical SSR Pattern Discoveries

This document captures the key learnings from analyzing Makerkit's SSR patterns to avoid the hydration errors that forced a complete restart in the previous integration attempt.

## 1. Data Loading Pattern (CRITICAL)

### ❌ WRONG Pattern (Causes Hydration Errors)
```typescript
import { useLoaderData } from 'react-router';

export default function EventsPage() {
  const data = useLoaderData(); // Client-side hook
  return <Component />;
}
```

### ✅ CORRECT Pattern (SSR-Safe)
```typescript
import type { Route } from '~/types/app/routes/events/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  return { title: 'Events' };
};

export default function EventsPage(props: Route.ComponentProps) {
  const data = props.loaderData; // Server-safe props access
  return <Component />;
}
```

**Why This Matters**: 
- `useLoaderData()` is a client-side hook that doesn't work during server rendering
- `props.loaderData` provides the same data but works on both server and client
- Mismatch between server and client rendering causes hydration errors

## 2. Form Handling Pattern (Complex Discovery)

### Forms Require Two-Part Implementation

#### Part 1: Route File (Server-Side)
```typescript
// routes/contact/index.tsx
export const action = async ({ request }: Route.ActionArgs) => {
  const data = await request.json();
  
  // CSRF protection for mutations
  await verifyCsrfToken(request, data.csrfToken);
  
  // Process form
  return { success: true };
};

export default function ContactPage(props: Route.ComponentProps) {
  return <ContactForm />;
}
```

#### Part 2: Form Component (Client-Side)
```typescript
// components/contact-form.tsx
'use client'; // If needed

import { useFetcher } from 'react-router';

export function ContactForm() {
  const fetcher = useFetcher<{ success: boolean }>();
  
  const handleSubmit = (data) => {
    fetcher.submit(data, {
      method: 'POST',
      encType: 'application/json',
    });
  };
  
  // Form JSX...
}
```

**Why Forms Failed Before**:
- Magic Patterns forms don't have this two-part structure
- No `action` exports for server-side processing
- Missing CSRF token handling
- Different state management approach

## 3. Navigation Context Mismatch

### Magic Patterns Navigation
```typescript
import { useNavigationContext } from '../../context/NavigationContext';

const { navigateTo } = useNavigationContext();
navigateTo('/events');
```

### React Router Navigation
```typescript
import { useNavigate } from 'react-router';

const navigate = useNavigate();
navigate('/events');
```

**Fix Required**: Global find/replace across all Magic Patterns files before integration

## 4. Layout Integration Pattern

### Problem: Duplicate Headers/Footers
If both Makerkit and Magic Patterns layouts are active, users see double headers

### Solution: Complete Layout Replacement
```typescript
// routes/marketing/layout.tsx
import { Outlet } from 'react-router';
import { Header } from '~/components/magic-patterns/components/layout/Header';
import { Footer } from '~/components/magic-patterns/components/layout/Footer';

export default function MarketingLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
```

## 5. TypeScript Types Pattern

### Always Use Route Types
```typescript
import type { Route } from '~/types/app/routes/[path]/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {};
export const action = async ({ request }: Route.ActionArgs) => {};
export const meta = ({ data }: Route.MetaArgs) => {};
export default function Page(props: Route.ComponentProps) {}
```

## 6. Common SSR Pitfalls to Avoid

### Browser-Only Code
```typescript
// ❌ WRONG - Breaks SSR
if (window.localStorage.getItem('theme')) {}

// ✅ CORRECT - Safe for SSR
if (typeof window !== 'undefined' && window.localStorage.getItem('theme')) {}
```

### Direct DOM Manipulation
```typescript
// ❌ WRONG - No document during SSR
document.getElementById('root')

// ✅ CORRECT - Use React refs
const rootRef = useRef(null);
```

## 7. Authentication State Pattern

### Passing Auth to Components
```typescript
// In layout loader
export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  
  return { user };
};

// Pass to Header
export default function Layout(props: Route.ComponentProps) {
  const { user } = props.loaderData;
  return <Header user={user} />;
}
```

## 8. Data Fetching Strategy

### Initial Integration (Use Mock Data)
```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  return {
    events: null, // Let Magic Patterns use its own mock data
  };
};
```

### Future Integration (Real Data)
```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const { data: events } = await client.from('events').select('*');
  
  return { events };
};

// Update Magic Patterns component to accept props
<EventsPage events={events} />
```

## 9. CSRF Protection Pattern

### For Any Mutation Operation
```typescript
import { verifyCsrfToken } from '@kit/csrf/server';

export const action = async ({ request }: Route.ActionArgs) => {
  const data = await request.json();
  
  // Always verify CSRF token first
  await verifyCsrfToken(request, data.csrfToken);
  
  // Then perform mutation
  return performAction(data);
};
```

## 10. Testing Strategy

### Progressive Validation
1. **Single Route Test**: Implement one route completely first
2. **Build Test**: `pnpm build` must succeed
3. **Hydration Test**: Check browser console for errors
4. **SSR Test**: View page source to verify server rendering
5. **Navigation Test**: Ensure all links work
6. **Form Test**: If applicable, test form submission

### Only After Success
- Proceed with remaining 94+ routes
- Use the same verified patterns
- Test in batches (5-10 routes at a time)

## Summary: Why The Previous Attempt Failed

1. **Wrong Data Pattern**: Used `useLoaderData()` instead of `props.loaderData`
2. **Form Handling**: Didn't adapt Magic Patterns forms to SSR action pattern
3. **Navigation Mismatch**: NavigationContext vs React Router incompatibility
4. **No Progressive Testing**: Tried to do all 95+ pages at once
5. **Layout Conflicts**: Duplicate headers/footers from both systems

## The Right Approach

1. **Fix Navigation First**: Run script to update all Magic Patterns files
2. **Test One Route**: Verify SSR patterns work without hydration errors
3. **Progressive Integration**: Add routes in small batches
4. **Maintain Patterns**: Use exact same patterns for consistency
5. **Test Continuously**: Build and test after each batch

---

**Remember**: The difference between `useLoaderData()` and `props.loaderData` is the difference between success and 58+ files of hydration errors!