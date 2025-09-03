# Railway Environment Variables Guide

This document lists all environment variables needed for the GoEventCity + Makerkit deployment on Railway.

## Required Environment Variables

### Core Application
```bash
# Application URL (set by Railway automatically)
VITE_SITE_URL=https://your-app.up.railway.app

# Node Environment
NODE_ENV=production

# CMS Configuration (fixes the "Unknown CMS type" error)
VITE_CMS_CLIENT=keystatic
```

### Supabase Configuration
```bash
# Supabase Project Reference (from your Supabase dashboard)
SUPABASE_PROJECT_REF=your-project-ref

# Supabase URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Key (public key)
VITE_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role Key (private key - keep secure!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Supabase Database URL (if using direct database connections)
SUPABASE_DB_URL=postgresql://postgres.your-project:password@db.your-project.supabase.co:5432/postgres
```

### Authentication Configuration
```bash
# Auth Redirect URL
VITE_AUTH_REDIRECT_URL=/auth/callback
```

### Billing Configuration (Optional - if using billing features)
```bash
# Stripe Configuration
VITE_BILLING_PROVIDER=stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email Configuration (Optional)
```bash
# Resend API Key (if using Resend for emails)
RESEND_API_KEY=re_...
```

### Feature Flags
```bash
# Enable/Disable Features
VITE_ENABLE_THEME_TOGGLE=true
VITE_ENABLE_PERSONAL_ACCOUNT_DELETION=false
VITE_ENABLE_TEAM_ACCOUNTS=true
VITE_ENABLE_TEAM_ACCOUNTS_CREATION=true
VITE_ENABLE_TEAM_ACCOUNTS_DELETION=false
VITE_ENABLE_PERSONAL_ACCOUNT_BILLING=false
VITE_ENABLE_TEAM_ACCOUNTS_BILLING=false
VITE_ENABLE_NOTIFICATIONS=true
VITE_REALTIME_NOTIFICATIONS=false
VITE_ENABLE_VERSION_UPDATER=false
VITE_LANGUAGE_PRIORITY=application
```

### Optional Services
```bash
# Turnstile (Cloudflare CAPTCHA)
VITE_TURNSTILE_SITE_KEY=your-site-key

# PostHog Analytics
VITE_POSTHOG_API_KEY=your-api-key
VITE_POSTHOG_API_HOST=https://app.posthog.com

# Sentry Error Tracking
VITE_SENTRY_DSN=your-sentry-dsn
```

## Setting Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service (web)
3. Navigate to the "Variables" tab
4. Click "Add Variable" and add each variable listed above

### Important Notes:

1. **VITE_ prefix**: Variables with `VITE_` prefix are exposed to the client-side build
2. **Sensitive Keys**: Never expose service role keys or secret keys to the client
3. **CMS Configuration**: The `VITE_CMS_CLIENT=keystatic` is required to fix the "Unknown CMS type" error
4. **Railway Auto Variables**: Railway automatically sets `PORT` and generates the service URL

## Minimal Required Set

For a basic deployment, you need at minimum:
- `VITE_CMS_CLIENT=keystatic`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- All the feature flag variables (or they'll default to the values in feature-flags.config.ts)

## Verification

After setting the environment variables:
1. Trigger a new deployment in Railway
2. Check the build logs for any missing variable errors
3. Visit `/healthcheck` endpoint to verify the app is running
4. Check `/blog.data` and `/docs.data` endpoints - they should not return 500 errors