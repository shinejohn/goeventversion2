# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Core Technologies

- **React Router 7** in SSR/Framework mode
- **Supabase** for database, auth, and storage
- **React 19**
- **TypeScript** with strict configuration
- **Tailwind CSS 4** for styling
- **Turborepo** for monorepo management

### Monorepo Structure

- @apps/web - Main React Router 7 SaaS application
- @apps/e2e - Playwright end-to-end tests
- @packages/ - Shared packages and utilities
- @tooling/ - Build tools and development scripts

### Key Package Categories

- **Features**: Domain-specific functionality (`features/auth`, `features/team-accounts`, `features/billing`)
- **UI**: Shared components (`ui/shadcn`, `ui/makerkit`)
- **Infrastructure**: Core services (`supabase`, `billing/core`, `monitoring`)
- **Utils**: Cross-cutting utilities (`shared`, `i18n`, `csrf`)

### Multi-Tenant Architecture

### Multi-tenancy Model

The app supports both personal and team accounts:

- Personal accounts: Direct user access (`/home`)
- Team accounts: Collaborative workspaces (`/home/:account`)
- Role-based permissions within team accounts
- Account selection happens via account selector components

## Essential Commands

### Development Workflow

```bash
pnpm dev                    # Start all apps
pnpm --filter web dev       # Main app (port 3000)
pnpm --filter dev-tool dev  # Dev tools (port 3010)
pnpm build                  # Build all apps
```

### Database Operations

```bash
pnpm supabase:web:start     # Start Supabase locally
pnpm supabase:web:reset     # Reset with latest schema
pnpm supabase:web:typegen   # Generate TypeScript types
pnpm --filter web supabase:db:diff  # Create migration
```

### Code Quality

```bash
pnpm lint && pnpm format    # Lint and format
pnpm typecheck              # Type checking
pnpm test                   # Run tests
```

### Route Architecture

Routes are defined in `apps/web/app/routes.ts` using React Router's configuration:

- **Marketing**: Landing pages, docs, blog (`/`, `/pricing`, `/docs/*`)
- **Auth**: Authentication flows (`/auth/*`)
- **App**: User dashboard and team workspaces (`/home`, `/home/:account`)
- **Admin**: Super admin interface (`/admin/*`)
- **API**: Server endpoints (`/api/*`)

## Database Guidelines

### Security & RLS Implementation

**Critical Security Guidelines - Read Carefully! ⚠️**

#### Database Security Fundamentals

- **Always enable RLS** on new tables unless explicitly instructed otherwise
- **NEVER use SECURITY DEFINER functions** without explicit access controls - they bypass RLS entirely
- **Always use security_invoker=true for views** to maintain proper access control
- **Storage buckets MUST validate access** using account_id in the path structure. See @apps/web/supabase/schemas/16-storage.sql for proper implementation.
- **Use locks if required**: Database locks prevent race conditions and timing attacks in concurrent operations. Make sure to take these into account for all database operations.

#### Security Definer Function - Dangerous Pattern ❌

```sql
-- NEVER DO THIS - Allows any authenticated user to call function
CREATE OR REPLACE FUNCTION public.dangerous_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $
BEGIN
  -- This bypasses all RLS policies!
  DELETE FROM sensitive_table; -- Anyone can call this!
END;
$;
GRANT EXECUTE ON FUNCTION public.dangerous_function() TO authenticated;
```

#### Security Definer Function - Safe Pattern ✅

```sql
-- ONLY use SECURITY DEFINER with explicit access validation
CREATE OR REPLACE FUNCTION public.safe_admin_function(target_account_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '' AS $
BEGIN
  -- MUST validate caller has permission FIRST
  IF NOT public.is_account_owner(target_account_id) THEN
    RAISE EXCEPTION 'Access denied: insufficient permissions';
  END IF;

  -- Now safe to proceed with elevated privileges
  -- Your admin operation here
END;
$;
```

#### Existing Helper Functions - Use These! 📚

**DO NOT recreate these functions - they already exist:**

```sql
-- Account Access Control
public.has_role_on_account(account_id, role?)     -- Check team membership
public.has_permission(user_id, account_id, permission)  -- Check permissions
public.is_account_owner(account_id)               -- Verify ownership
public.has_active_subscription(account_id)        -- Subscription status
public.is_team_member(account_id, user_id)        -- Direct membership check
public.can_action_account_member(target_account_id, target_user_id) -- Member action rights

-- Administrative Functions
public.is_super_admin()                           -- Super admin check
public.is_aal2()                                  -- MFA verification
public.is_mfa_compliant()                         -- MFA compliance

-- Configuration
public.is_set(field_name)                         -- Feature flag checks
```

Always check @apps/web/supabase/schemas/ before creating new functions!

#### RLS Policy Best Practices ✅

```sql
-- Proper RLS using existing helper functions
CREATE POLICY "notes_read" ON public.notes FOR SELECT
  TO authenticated USING (
    account_id = (select auth.uid()) OR
    public.has_role_on_account(account_id)
  );

-- For operations requiring specific permissions
CREATE POLICY "notes_manage" ON public.notes FOR ALL
  TO authenticated USING (
    public.has_permission(auth.uid(), account_id, 'notes.manage'::app_permissions)
  );
```

### Schema Management Workflow

1. Create schemas in @apps/web/supabase/schemas/ as `<number>-<name>.sql`
2. After changes: `pnpm supabase:web:stop`
3. Run: `pnpm --filter web run supabase:db:diff -f <filename>`
4. Restart: `pnpm supabase:web:start` and `pnpm supabase:web:reset`
5. Generate types: `pnpm supabase:web:typegen`

Key schema files:

- Accounts: @apps/web/supabase/schemas/03-accounts.sql
- Memberships: @apps/web/supabase/schemas/05-memberships.sql
- Permissions: @apps/web/supabase/schemas/06-roles-permissions.sql

### Type Generation

```typescript
import { Tables } from '@kit/supabase/database';

type Account = Tables<'accounts'>;
```

Always prefer inferring types from generated Database types.

## Development Patterns

### Data Fetching Strategy

**Quick Decision Framework:**

- **Loaders**: Default choice for initial data loading using React Router 7 loaders
- **Components**: For interactive features requiring hooks or real-time updates
- **Admin Client**: Only for bypassing RLS (rare cases - requires manual auth/authorization)

#### Server Components (Preferred) ✅

```typescript
import type { Route } from '~/types/app/routes/home/+types/route.ts';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader(args: Route.args) {
  const client = getSupabaseServerClient();
  const { data, error } = await client.from('notes').select('*');

  if (error) {
    return [];
  }

  return data;
}

async function NotesPage() {
  const data = useLoaderData<typeof loader>();

  // render data
}
```

#### Client Components (Interactive) 🖱️

```typescript
'use client';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useQuery } from '@tanstack/react-query';

function InteractiveNotes() {
  const supabase = useSupabase();
  const { data, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => supabase.from('notes').select('*')
  });

  if (isLoading) return <Spinner />;
  return <NotesList notes={data} />;
}
```

#### Performance Optimization - Parallel Data Fetching 🚀

**Sequential (Slow) Pattern ❌**

```typescript
export async function loader() {
  const userData = await loadUserData();
  const notifications = await loadNotifications();
  const metrics = await loadMetrics();
  // Total time: sum of all requests
}
```

**Parallel (Optimized) Pattern ✅**

```typescript
export async function loader() {
  // Execute all requests simultaneously
  const [userData, notifications, metrics] = await Promise.all([
    loadUserData(),
    loadNotifications(),
    loadMetrics()
  ]);

  // Total time: longest single request
}
```

**Performance Impact**: Parallel fetching can reduce page load time by 60-80% for multi-data pages!

### Authorization Patterns - Critical Understanding 🔐

#### RLS-Protected Data Fetching (Standard) ✅

```typescript
async function getUserNotes(userId: string) {
  const client = getSupabaseServerClient();

  // RLS automatically ensures user can only access their own notes
  // NO additional authorization checks needed!
  const { data } = await client.from('notes').select('*').eq('user_id', userId); // RLS validates this automatically

  return data;
}
```

#### Admin Client Usage (Dangerous - Rare Cases Only) ⚠️

```typescript
async function adminGetUserNotes(userId: string) {
  const adminClient = getSupabaseServerAdminClient();

  // CRITICAL: Manual authorization required - bypasses RLS!
  const currentUser = await getCurrentUser();
  if (!(await isSuperAdmin(currentUser))) {
    throw new Error('Unauthorized: Admin access required');
  }

  // Additional validation: ensure current admin isn't targeting themselves
  if (currentUser.id === userId) {
    throw new Error('Cannot perform admin action on own account');
  }

  // Now safe to proceed with admin privileges
  const { data } = await adminClient
    .from('notes')
    .select('*')
    .eq('user_id', userId);

  return data;
}
```

**Rule of thumb**: If using standard Supabase client, trust RLS. If using admin client, validate everything manually.

## React & TypeScript Best Practices

### TS

- Write clean, clear, well-designed, explicit Typescript
- Use implicit type inference, unless impossible
- `any` and `unknown` are a code smell and must justified if used
- Handle errors gracefully using try/catch and appropriate error types.

### Components

- Use functional components with TypeScript
- Always use 'use client' directive for client components
- Destructure props with proper TypeScript interfaces
- Name files to match component name (e.g., user-profile.tsx)

### Conditional Rendering

Use the `If` component from @packages/ui/src/makerkit/if.tsx:

```tsx
import { If } from '@kit/ui/if';

<If condition={isLoading} fallback={<Content />}>
  <Spinner />
</If>

// With type inference
<If condition={error}>
  {(err) => <ErrorMessage error={err} />}
</If>
```

### Testing Attributes

```tsx
<button data-test="submit-button">Submit</button>
<div data-test="user-profile" data-user-id={user.id}>Profile</div>
```

### Internationalization

Always use `Trans` component from @packages/ui/src/makerkit/trans.tsx:

```tsx
import { Trans } from '@kit/ui/trans';

<Trans
  i18nKey="user:welcomeMessage"
  values={{ name: user.name }}
/>

// With HTML elements
<Trans
  i18nKey="terms:agreement"
  components={{
    TermsLink: <a href="/terms" className="underline" />,
  }}
/>
```

Adding new languages:

1. Add language code to @apps/web/lib/i18n/i18n.settings.ts
2. Create translation files in @apps/web/public/locales/[new-language]/
3. Copy structure from English files

Translation files: @apps/web/public/locales/<locale>/<namespace>.json

## Security Guidelines 🛡️

### Authentication & Authorization

- Authentication enforced by middleware
- Authorization handled by RLS at database level
- Avoid defensive code - use RLS instead
- For admin client usage, enforce both authentication and authorization

### Data Passing

- **Never pass sensitive data** to Client Components
- **Never expose server environment variables** to client (unless prefixed with NEXT_PUBLIC)
- Always validate user input

### OTP for Sensitive Operations

Use one-time tokens from @packages/otp/src/api/index.ts:

```tsx
import { VerifyOtpForm } from '@kit/otp/components';

<VerifyOtpForm
  purpose="account-deletion"
  email={user.email}
  onSuccess={(otp) => {
    // Proceed with verified operation
  }}
/>;
```

### Super Admin Protection

For admin routes, protect loaders with the `getSuperAdminUser` function:

```tsx
export const loader = async function (args: Route.LoaderArgs) {
  const client = getSupabaseServerClient(args.request);

  // admin protected route
  await getSuperAdminUser(client);

  return loadAdminDashboard(client);
};
```

## UI Components 🎨

### Core UI Library

Import from @packages/ui/src/:

```tsx
// Shadcn components
import { Button } from '@kit/ui/button';
import { Card } from '@kit/ui/card';
// Makerkit components
import { If } from '@kit/ui/if';
import { ProfileAvatar } from '@kit/ui/profile-avatar';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';
```

### Styling

- Use Tailwind CSS v4 with semantic classes
- Prefer Shadcn-ui classes like `bg-background`, `text-muted-foreground`
- Use `cn()` utility from @kit/ui/cn for class merging

## Error Handling & Logging 📊

### Structured Logging

Use logger from @packages/shared/src/logger/logger.ts:

```typescript
import { getLogger } from '@kit/shared/logger';

async function myServerFunction() {
  const logger = await getLogger();
  const ctx = { name: 'myOperation', userId: user.id };

  try {
    logger.info(ctx, 'Operation started');
    // ...
  } catch (error) {
    logger.error({ ...ctx, error }, 'Operation failed');
    // handle error
  }
}
```

## API Services

### Account Services

- Personal accounts API: @packages/features/accounts/src/server/api.ts
- Team accounts API: @packages/features/team-accounts/src/server/api.ts
- Admin service: @packages/features/admin/src/lib/server/services/admin.service.ts

## Key Configuration Files

- **Feature flags**: @apps/web/config/feature-flags.config.ts
- **i18n settings**: @apps/web/lib/i18n/i18n.settings.ts
- **Supabase config**: @apps/web/supabase/config.toml

## Quick Reference Checklist ✅

### Development Workflow

- [ ] Enable RLS on new tables
- [ ] Generate TypeScript types after schema changes and infer types from these
- [ ] Implement proper error handling with logging
- [ ] Use Zod schemas for parsing all user input (including cookies, query params, etc.)
- [ ] Add testing attributes to interactive elements
- [ ] Validate permissions before sensitive operations
