# Magic Patterns Integration Guide for React Router 7

This guide explains how to properly integrate Magic Patterns UI components with React Router 7 while maintaining the original Vite/Magic Patterns look and feel.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Magic Patterns UI Layer         │ ← Your custom UI components
├─────────────────────────────────────────┤
│        React Router 7 (SSR)             │ ← Routing and data loading
├─────────────────────────────────────────┤
│       Makerkit Backend Services         │ ← Auth, DB, Billing, etc.
├─────────────────────────────────────────┤
│           Supabase Database             │ ← Data persistence
└─────────────────────────────────────────┘
```

## Key Integration Points

### 1. Layout Components
- `magic-patterns-public.tsx` - Public pages with header/footer
- `magic-patterns-auth.tsx` - Centered auth pages
- `magic-patterns-dashboard.tsx` - Dashboard with sidebar
- `magic-patterns-admin.tsx` - Admin interface
- `booking-flow.tsx` - Multi-step booking wizard
- `checkout-flow.tsx` - Payment flows

### 2. Route Organization
```typescript
// Use the refactored routes.ts structure
export default [
  ...systemRoutes,
  ...apiRoutes,
  magicPatternsPublicLayout,    // All public pages
  magicPatternsAuthLayout,      // Auth flows
  magicPatternsDashboardLayout, // User dashboards
  magicPatternsAdminLayout,     // Admin pages
  bookingFlowLayout,           // Booking wizard
  checkoutFlowLayout,          // Payment flows
  catchAllRoute,               // 404 handler
] satisfies RouteConfig;
```

### 3. Data Loading Pattern
```typescript
// In your route file (e.g., venues/index.tsx)
export const loader = async ({ request }: Route.LoaderArgs) => {
  // 1. Validate query params with Zod
  const params = VenuesQuerySchema.parse(queryParams);
  
  // 2. Fetch data with Supabase
  const client = getSupabaseServerClient(request);
  const { data, error } = await client.from('venues').select('*');
  
  // 3. Transform data for Magic Patterns components
  const transformedData = transformVenuesList(data);
  
  // 4. Return with error handling
  return { venues: transformedData, error };
};

// Use the Magic Patterns wrapper for consistent rendering
export default createMagicPatternsRoute({
  component: VenuesPage,
  transformData: (loaderData) => loaderData,
});
```

### 4. Component Integration
```typescript
// Use the route wrapper for all Magic Patterns pages
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { YourMagicPatternsComponent } from '~/components/magic-patterns/pages/YourPage';

export default createMagicPatternsRoute({
  component: YourMagicPatternsComponent,
  transformData: (loaderData) => ({
    // Map loader data to component props
    ...loaderData
  }),
});
```

### 5. Type Safety with Transformers
```typescript
// Use data transformers for type safety
import { transformVenueData, type VenueData } from '~/lib/magic-patterns/data-transformers';

// Transform Supabase data to Magic Patterns types
const venue: VenueData = transformVenueData(supabaseVenue);
```

## Migration Steps

### Step 1: Update Routes Structure
1. Replace the current `routes.ts` with the refactored version
2. Create layout components in `routes/layouts/`
3. Move route files to match new structure

### Step 2: Create Route Wrappers
For each Magic Patterns page:
```typescript
// Old pattern (direct component usage)
export default function VenuesRoute({ loaderData }) {
  return <VenuesPage venues={loaderData.venues} />;
}

// New pattern (with wrapper)
export default createMagicPatternsRoute({
  component: VenuesPage,
  transformData: (loaderData) => ({ venues: loaderData.venues }),
});
```

### Step 3: Implement Data Transformers
1. Define schemas for each data type
2. Create transformer functions
3. Use in loaders before returning data

### Step 4: Update Imports
```typescript
// Update all Magic Patterns imports to use tilde path
import { Header } from '~/components/magic-patterns/components/layout/Header';
import { VenuesPage } from '~/components/magic-patterns/pages/VenuesPage';
```

### Step 5: Remove Makerkit UI Dependencies
1. Identify all Makerkit UI imports
2. Replace with Magic Patterns equivalents
3. Keep only backend service imports from Makerkit

## Common Patterns

### Error Handling
```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    // Your data loading logic
    return { data, error: null };
  } catch (error) {
    // Log error but don't throw
    logger.error({ error }, 'Loader failed');
    return { data: null, error: error.message };
  }
};
```

### Parallel Data Loading
```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Load all data in parallel
  const [venues, events, performers] = await Promise.all([
    client.from('venues').select('*'),
    client.from('events').select('*'),
    client.from('performers').select('*'),
  ]);
  
  return {
    venues: transformVenuesList(venues.data || []),
    events: transformEventsList(events.data || []),
    performers: transformPerformersList(performers.data || []),
  };
};
```

### SEO and Performance
```typescript
// Add meta tags
export const meta = () => {
  return [
    { title: 'Your Page Title' },
    { name: 'description', content: 'Your page description' },
  ];
};

// Add cache headers
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300',
  };
};
```

## Troubleshooting

### Issue: Components not rendering
- Check that the layout is properly wrapping the route
- Verify data transformers are returning correct shape
- Use the error boundary to catch render errors

### Issue: Styles not matching
- Ensure Tailwind classes match Magic Patterns originals
- Check that layout components have correct structure
- Verify no conflicting Makerkit styles are loaded

### Issue: Data not loading
- Check Supabase RLS policies
- Verify loader is returning data in correct format
- Use logging to debug data flow

### Issue: TypeScript errors
- Run `pnpm supabase:web:typegen` to update types
- Check that transformers match component prop types
- Use proper type imports from generated database types

## Best Practices

1. **Always use the route wrapper** for consistent error handling
2. **Transform data in loaders** not in components
3. **Log all operations** for debugging
4. **Validate inputs** with Zod schemas
5. **Handle errors gracefully** without breaking the UI
6. **Optimize queries** with proper indexes and pagination
7. **Cache appropriately** using headers
8. **Keep components pure** - data loading in loaders only

## Next Steps

1. Start with high-traffic pages (venues, events)
2. Migrate auth flows to ensure consistent experience
3. Update dashboard pages for authenticated users
4. Test thoroughly with different data scenarios
5. Monitor performance and optimize as needed