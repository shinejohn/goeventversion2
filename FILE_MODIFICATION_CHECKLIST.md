# File Modification Checklist for Magic Patterns Integration

## Overview
This checklist tracks every file that needs modification, organized by type and phase. Use this for execution tracking and final audit.

## Phase 1: Foundation Fixes

### Navigation Fix (Script-Based)
**Files**: All files in `/apps/web/app/components/magic-patterns/**/*.{tsx,ts,jsx,js}`
- [ ] Run `node scripts/fix-magic-patterns-navigation.js --dry-run`
- [ ] Review changes
- [ ] Run `node scripts/fix-magic-patterns-navigation.js`
- [ ] Verify backups created (*.backup files)

**Changes per file**:
- [ ] `import { useNavigationContext }` → `import { useNavigate }`
- [ ] `const { navigateTo } = useNavigationContext()` → `const navigate = useNavigate()`
- [ ] `navigateTo(` → `navigate(`

### SSR Browser API Fixes
**Run**: `node scripts/check-ssr-compatibility.js` to identify files

**High Priority Files** (from initial scan):
- [ ] `/components/magic-patterns/pages/HomePage.tsx`
  - [ ] Line 236: `window.location.origin` → wrap with typeof check
  - [ ] Lines 256-261: `document.createElement` → use React ref
- [ ] `/components/magic-patterns/pages/checkout/CheckoutPaymentPage.tsx`
  - [ ] Lines 20-21: `sessionStorage.getItem` → wrap with typeof check
  - [ ] Line 42: `sessionStorage.setItem` → wrap with typeof check
- [ ] `/components/magic-patterns/pages/venues/[venueId]/[venueSlug].tsx`
  - [ ] Lines 341-345: `navigator.share` → feature detection wrapper
  - [ ] Line 1060: `window.scrollTo` → wrap with typeof check

**Pattern for each fix**:
```typescript
// Before
const data = sessionStorage.getItem('key');

// After
const data = typeof window !== 'undefined' ? sessionStorage.getItem('key') : null;
```

### Tailwind CSS Updates
- [ ] `/apps/web/app/components/magic-patterns/index.css`
  - [ ] Remove `@import 'tailwindcss/base';`
  - [ ] Remove `@import 'tailwindcss/components';`
  - [ ] Remove `@import 'tailwindcss/utilities';`
  - [ ] Add comment: `/* Tailwind imported via main app global.css */`

- [ ] `/apps/web/styles/global.css`
  - [ ] Add line: `@source "../app/components/magic-patterns/**/*.{ts,tsx}";`

## Phase 2: Component Updates

### Header Component
- [ ] `/components/magic-patterns/components/layout/MainHeader.tsx`
  - [ ] Add interface: `interface MainHeaderProps { user?: {...} | null }`
  - [ ] Change signature: `export const MainHeader = ({ user }: MainHeaderProps) =>`
  - [ ] Remove: `const [isLoggedIn, setIsLoggedIn] = useState(false)`
  - [ ] Remove: `const [userProfile, setUserProfile] = useState({...})`
  - [ ] Add: `const isLoggedIn = !!user`
  - [ ] Add: `const userProfile = { avatar: user?.user_metadata?.avatar_url || '', ... }`

### Footer Component
- [ ] `/components/magic-patterns/components/layout/Footer.tsx`
  - [ ] No changes needed (navigation fix handles it)

### ProfileDropdown Component
- [ ] `/components/magic-patterns/components/ui/ProfileDropdown.tsx`
  - [ ] Add sign-out functionality
  - [ ] Accept user data props

## Phase 3: Layout Files

### Marketing Layout
- [ ] `/apps/web/app/routes/marketing/layout.tsx`
  ```typescript
  - [ ] Import MainHeader and Footer from magic-patterns
  - [ ] Add loader function with user check
  - [ ] Pass user to MainHeader
  - [ ] Remove Makerkit SiteHeader/SiteFooter imports
  ```

### User Dashboard Layout
- [ ] `/apps/web/app/routes/home/user/layout.tsx`
  ```typescript
  - [ ] Import MainHeader from magic-patterns
  - [ ] Ensure loader redirects if no user
  - [ ] Pass user to MainHeader
  ```

### Account Layout
- [ ] `/apps/web/app/routes/home/account/layout.tsx`
  ```typescript
  - [ ] Same pattern as user layout
  ```

## Phase 4: Route Files Creation

### Route File Template Checklist
For EACH route file created:
- [ ] Import Magic Patterns page component
- [ ] Add loader with proper typing: `Route.LoaderArgs`
- [ ] Return data including title for meta
- [ ] Add meta function with proper typing: `Route.MetaArgs`
- [ ] Export default with proper typing: `Route.ComponentProps`
- [ ] Use `props.loaderData` NOT `useLoaderData()`
- [ ] Test route individually

### Public Routes (No Auth)
Create route files for:
- [ ] `/apps/web/app/routes/marketing/index.tsx` → HomePage
- [ ] `/apps/web/app/routes/events/index.tsx` → EventsPage
- [ ] `/apps/web/app/routes/venues/index.tsx` → VenuesPage
- [ ] `/apps/web/app/routes/performers/index.tsx` → PerformersPage
- [ ] `/apps/web/app/routes/about/index.tsx` → AboutPage
- [ ] `/apps/web/app/routes/contact/index.tsx` → ContactUsPage
- [ ] `/apps/web/app/routes/how-it-works/index.tsx` → HowItWorksPage

### Dynamic Routes
- [ ] `/apps/web/app/routes/events/$id.tsx` → EventDetailPage
- [ ] `/apps/web/app/routes/venues/$id.$slug.tsx` → VenueDetailPage
- [ ] `/apps/web/app/routes/performers/$id.tsx` → PerformerProfilePage

### Auth Routes (Special Handling)
- [ ] `/apps/web/app/routes/auth/sign-in.tsx` → Integrate LoginPage
- [ ] `/apps/web/app/routes/auth/sign-up.tsx` → Integrate RegisterPage

### Protected Routes (Auth Required)
- [ ] `/apps/web/app/routes/home/user/index.tsx` → FanDashboardPage
- [ ] `/apps/web/app/routes/home/user/calendar/index.tsx` → CalendarPage
- [ ] `/apps/web/app/routes/home/user/tickets/index.tsx` → TicketsPage
- [ ] `/apps/web/app/routes/home/user/settings/index.tsx` → AccountSettingsPage

## Phase 5: Form Updates (Later Phase)

### Form Categories Checklist

#### Client-Only Forms (No Changes)
- [ ] Search forms
- [ ] Filter forms
- [ ] Sort dropdowns

#### Auth Forms (Integrate with Makerkit)
- [ ] LoginPage form
- [ ] RegisterPage form
- [ ] ForgotPasswordPage form

#### Data Creation Forms (Need Actions)
For each form:
- [ ] Add action to route file
- [ ] Create Zod schema
- [ ] Convert to useFetcher
- [ ] Add CSRF token
- [ ] Test submission

## Audit Scripts

### Navigation Audit
```bash
# Check for any remaining NavigationContext
grep -r "NavigationContext" apps/web/app/components/magic-patterns/

# Check for any remaining navigateTo
grep -r "navigateTo" apps/web/app/components/magic-patterns/
```

### SSR Audit
```bash
# Check for unwrapped window access
grep -r "window\." apps/web/app/components/magic-patterns/ | grep -v "typeof window"

# Check for unwrapped document access
grep -r "document\." apps/web/app/components/magic-patterns/ | grep -v "typeof document"
```

### Route Pattern Audit
```bash
# Check for useLoaderData usage (should use props.loaderData)
grep -r "useLoaderData" apps/web/app/routes/

# Check all routes have proper exports
grep -r "export const loader" apps/web/app/routes/
grep -r "export default function" apps/web/app/routes/
```

### Build Test
```bash
# Final verification
pnpm build
pnpm dev
```

## Progress Tracking

### Phase Completion
- [ ] Phase 1: Foundation Fixes
- [ ] Phase 2: Component Updates  
- [ ] Phase 3: Layout Files
- [ ] Phase 4: Route Files (Public)
- [ ] Phase 4: Route Files (Protected)
- [ ] Phase 5: Form Integration

### File Count Summary
- Navigation fixes: ~100 files
- SSR fixes: ~20 high priority files
- Component updates: 2 files (Header, ProfileDropdown)
- Layout updates: 3-4 files
- New route files: 95+ files
- Form updates: 47 files (future phase)

Total files touched: ~270 files