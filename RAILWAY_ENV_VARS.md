# Railway Environment Variables

Add these environment variables to your Railway deployment:

## Required Core Variables
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

VITE_SITE_URL=https://goeventversion2-production.up.railway.app
VITE_PRODUCT_NAME=GoEventCity
VITE_SITE_TITLE=GoEventCity - Discover Amazing Events in Your City
VITE_SITE_DESCRIPTION=GoEventCity helps you discover the best events, venues, and entertainment in your city.
```

## Feature Flags (All Required)
```
VITE_ENABLE_THEME_TOGGLE=true
VITE_ENABLE_PERSONAL_ACCOUNT_DELETION=false
VITE_ENABLE_PERSONAL_ACCOUNT_BILLING=false
VITE_ENABLE_TEAM_ACCOUNTS_DELETION=false
VITE_ENABLE_TEAM_ACCOUNTS_BILLING=false
VITE_ENABLE_TEAM_ACCOUNTS=true
VITE_ENABLE_TEAM_ACCOUNTS_CREATION=true
VITE_LANGUAGE_PRIORITY=application
VITE_ENABLE_NOTIFICATIONS=true
VITE_REALTIME_NOTIFICATIONS=false
VITE_ENABLE_VERSION_UPDATER=false
```

## Other Required Variables
```
VITE_DEFAULT_THEME_MODE=light
VITE_AUTH_PASSWORD=true
VITE_AUTH_MAGIC_LINK=false
VITE_BILLING_PROVIDER=stripe
VITE_CMS_CLIENT=keystatic
VITE_KEYSTATIC_CONTENT_PATH=./content
VITE_LOCALES_PATH=apps/web/public/locales

EMAIL_SENDER=noreply@yourdomain.com
CONTACT_EMAIL=contact@yourdomain.com
MAILER_PROVIDER=nodemailer
```

## Optional (if using Stripe)
```
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
```

## Note
The missing environment variables are what's causing the 404 error. The app fails to initialize properly without them.
EOF < /dev/null
