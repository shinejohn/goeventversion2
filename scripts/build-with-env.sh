#!/bin/bash
# Build script for Railway that injects environment variables at build time

echo "Building with Railway environment variables..."

# First, load the production defaults
if [ -f "apps/web/.env.production" ]; then
    echo "Loading production defaults from .env.production"
    export $(cat apps/web/.env.production | grep -v '^#' | xargs)
fi

# Then override with Railway environment variables
# This ensures Railway values take precedence over defaults
echo "Loading Railway environment variables..."
for var in $(printenv | grep ^VITE_ | cut -d= -f1); do
    export "$var"
done

# Also export other critical variables
export NODE_ENV=production

# Show which VITE_ variables are available (for debugging)
echo "Available VITE_ environment variables:"
printenv | grep ^VITE_ | sed 's/=.*/=***/' || echo "No VITE_ variables found"

# Show non-VITE critical variables
echo "Other critical environment variables:"
echo "NODE_ENV=$NODE_ENV"
echo "EMAIL_SENDER=${EMAIL_SENDER:+***}"
echo "SUPABASE_SECRET_KEY=${SUPABASE_SECRET_KEY:+***}"
echo "SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:+***}"

# Run the actual build
echo "Starting build process..."
pnpm build