# Authentication Integration Guide for Magic Patterns

## Current State Analysis

### Magic Patterns Header
Currently uses local state for authentication:
```typescript
// MainHeader.tsx
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userProfile, setUserProfile] = useState({
  avatar: '',
  notificationCount: 0,
  unreadMessageCount: 0
});
```

### Makerkit Pattern
Passes user data from layout loaders:
```typescript
// layout.tsx
export async function loader(args: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(args.request);
  const { data } = await requireUser(supabase);
  return { user: data };
}

export default function MarketingLayout() {
  const { user } = useLoaderData<typeof loader>();
  return <SiteHeader user={user} />;
}
```

## Required Code Changes

### 1. Update Magic Patterns Header Props

```typescript
// MainHeader.tsx
interface MainHeaderProps {
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      avatar_url?: string;
      full_name?: string;
    };
  } | null;
}

export const MainHeader = ({ user }: MainHeaderProps) => {
  // Remove local state
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Derive from props
  const isLoggedIn = !!user;
  const userProfile = {
    avatar: user?.user_metadata?.avatar_url || '',
    notificationCount: 0, // TODO: Fetch from database
    unreadMessageCount: 0, // TODO: Fetch from database
    email: user?.email,
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0]
  };
```

### 2. Update Layout Files

#### Marketing Layout (Public + Optional Auth)
```typescript
// routes/marketing/layout.tsx
import { Outlet } from 'react-router';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { MainHeader } from '~/components/magic-patterns/components/layout/MainHeader';
import { Footer } from '~/components/magic-patterns/components/layout/Footer';

export async function loader(args: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(args.request);
  const { data } = await requireUser(supabase);
  
  // Don't redirect if no user - this is public layout
  return { user: data };
}

export default function MarketingLayout() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <>
      <MainHeader user={user} />
      <Outlet />
      <Footer />
    </>
  );
}
```

#### User Dashboard Layout (Auth Required)
```typescript
// routes/home/user/layout.tsx
import { Outlet, redirect } from 'react-router';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { MainHeader } from '~/components/magic-patterns/components/layout/MainHeader';

export async function loader(args: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(args.request);
  const { data, error } = await requireUser(supabase);
  
  // Redirect to sign-in if no user
  if (error || !data) {
    throw redirect('/auth/sign-in');
  }
  
  return { user: data };
}

export default function UserLayout() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <>
      <MainHeader user={user} />
      <Outlet />
    </>
  );
}
```

### 3. Handle Conditional Features

Update MainHeader to handle auth-only features:
```typescript
// Show different nav items based on auth
{isLoggedIn && (
  <button onClick={() => navigate('/events/create')}>
    Create Event
  </button>
)}

// Show sign-in/profile based on auth
{isLoggedIn ? (
  <ProfileDropdown 
    avatar={userProfile.avatar} 
    email={userProfile.email}
    name={userProfile.name}
  />
) : (
  <div className="flex items-center space-x-3">
    <button onClick={() => navigate('/auth/sign-in')}>
      Sign In
    </button>
    <button onClick={() => navigate('/auth/sign-up')}>
      Get Started
    </button>
  </div>
)}
```

### 4. Update ProfileDropdown Component

```typescript
// ProfileDropdown.tsx
interface ProfileDropdownProps {
  avatar?: string;
  email?: string;
  name?: string;
}

export const ProfileDropdown = ({ avatar, email, name }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    // Call Makerkit sign-out action
    await fetch('/auth/sign-out', { method: 'POST' });
    navigate('/');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {avatar ? (
          <img src={avatar} alt={name} className="h-8 w-8 rounded-full" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate('/home/user')}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/home/user/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## Route Authentication Patterns

### Public Routes (No Auth Required)
```typescript
// No user check in loader
export async function loader() {
  return { title: 'Public Page' };
}
```

### Public Routes with Optional Auth
```typescript
// Check user but don't redirect
export async function loader(args: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(args.request);
  const { data: user } = await requireUser(supabase);
  return { user }; // May be null
}
```

### Protected Routes (Auth Required)
```typescript
// Redirect if no user
export async function loader(args: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(args.request);
  const { data: user, error } = await requireUser(supabase);
  
  if (error || !user) {
    throw redirect('/auth/sign-in');
  }
  
  return { user };
}
```

## Page Categories by Auth Requirements

### Always Public (No Auth Check)
- `/` (HomePage)
- `/about`
- `/contact`
- `/events` (browse)
- `/venues` (browse)
- `/performers` (browse)

### Public with Optional Auth (Show Different Content)
- `/events/:id` (can save/share if logged in)
- `/venues/:id` (can book if logged in)
- `/community/*` (can participate if logged in)

### Auth Required
- `/home/user/*` (all dashboard pages)
- `/events/create`
- `/bookings/*`
- `/tickets/*` (my tickets)
- `/profile/*`
- `/settings/*`

### Special Auth Pages
- `/auth/sign-in` (redirect if already logged in)
- `/auth/sign-up` (redirect if already logged in)
- `/auth/callback` (OAuth callback)

## Implementation Checklist

- [ ] Update MainHeader to accept user prop
- [ ] Remove local auth state from MainHeader
- [ ] Update all layout files to pass user data
- [ ] Update ProfileDropdown with sign-out functionality
- [ ] Test auth flow with sign-in/sign-out
- [ ] Verify protected routes redirect properly
- [ ] Check optional auth features work correctly
- [ ] Add notification/message counts (future: from database)

## Future Enhancements

1. **Real-time Updates**: Use Supabase realtime for notifications
2. **User Metadata**: Store avatar, name in user_metadata
3. **Notification System**: Create notifications table
4. **Message System**: Create messages table
5. **User Preferences**: Store theme, language preferences

## Testing Auth Integration

1. **Sign Out State**: Verify public nav shows sign-in buttons
2. **Sign In State**: Verify user menu and auth features appear
3. **Protected Routes**: Verify redirect to sign-in
4. **Optional Auth**: Verify different content for logged in/out
5. **Sign Out Flow**: Verify clears session and redirects