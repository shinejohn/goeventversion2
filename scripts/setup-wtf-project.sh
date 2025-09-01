#!/bin/bash
# When's The Fun (GoEventCity) - Automated Setup Script
# This script reproduces the complete integration setup

set -e  # Exit on any error

echo "🎉 Setting up When's The Fun (GoEventCity) project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/web" ]; then
    print_error "This script must be run from the project root directory"
    print_error "Expected to find package.json and apps/web directory"
    exit 1
fi

print_status "Verifying project structure..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node --version)"
    exit 1
fi
print_success "Node.js version check passed: $(node --version)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is required but not installed"
    print_error "Install with: npm install -g pnpm"
    exit 1
fi
print_success "pnpm found: $(pnpm --version)"

# Install dependencies
print_status "Installing dependencies..."
pnpm install
print_success "Dependencies installed"

# Set up environment files
print_status "Setting up environment configuration..."

# Create apps/web/.env.local if it doesn't exist
if [ ! -f "apps/web/.env.local" ]; then
    print_warning "Creating apps/web/.env.local template"
    cat > apps/web/.env.local << 'EOF'
# Supabase Configuration
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# When's The Fun Specific
WTF_APP_NAME="When's The Fun"
WTF_DEFAULT_LOCATION="Clearwater, FL"
USE_REAL_DATA=false

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"
CLOUDFLARE_KV_NAMESPACE_ID="your-kv-namespace"
CLOUDFLARE_R2_BUCKET="when-the-fun-uploads"
CLOUDFLARE_TURNSTILE_SITE_KEY="your-turnstile-site-key"
CLOUDFLARE_TURNSTILE_SECRET_KEY="your-turnstile-secret"
CLOUDFLARE_ANALYTICS_BEACON="your-analytics-beacon"

# PostGIS & Geographic Features
ENABLE_POSTGIS=true
DEFAULT_RADIUS_MILES=50
EOF
    print_warning "Please update apps/web/.env.local with your actual values"
else
    print_success "Environment file already exists"
fi

# Verify key files exist
print_status "Verifying integration files..."

REQUIRED_FILES=(
    "apps/web/app/lib/services/data-service.ts"
    "apps/web/app/lib/services/geolocation.service.ts"
    "apps/web/app/lib/services/cloudflare-cache.service.ts"
    "apps/web/app/lib/services/r2-storage.service.ts"
    "apps/web/app/types/magic-patterns.ts"
    "apps/web/app/routes/c.\$communitySlug.tsx"
    "packages/supabase/migrations/20240101000001_wtf_core_schema.sql"
    "cloudflare-workers/geo-router.js"
    "railway.toml"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
        print_error "Missing file: $file"
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    print_success "All integration files present"
else
    print_error "Missing ${#MISSING_FILES[@]} required files"
    print_error "Please ensure all integration files are properly created"
    exit 1
fi

# Run Magic Patterns analysis
print_status "Running Magic Patterns analysis..."
if [ -f "apps/web/scripts/analyze-magic-patterns.ts" ]; then
    cd apps/web
    pnpm run analyze:mp
    cd ../..
    print_success "Magic Patterns analysis completed"
else
    print_warning "Magic Patterns analyzer script not found - skipping"
fi

# Type checking
print_status "Running TypeScript type check..."
pnpm run typecheck
if [ $? -eq 0 ]; then
    print_success "TypeScript type check passed"
else
    print_warning "TypeScript errors found - may need to fix before deployment"
fi

# Build test
print_status "Testing build process..."
pnpm run build
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed - please check configuration"
    exit 1
fi

# Check Railway configuration
print_status "Checking Railway deployment configuration..."
if grep -q 'startCommand = "pnpm start"' railway.toml; then
    print_warning "Railway configuration may need updating for monorepo"
    print_warning "See CHANGELOG-RAILWAY-FIX.md for deployment fix"
else
    print_success "Railway configuration looks correct"
fi

print_success "🎉 When's The Fun setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update apps/web/.env.local with your actual API keys"
echo "2. Set up your Supabase database and run migrations"
echo "3. Configure Cloudflare services (KV, R2, Analytics, Turnstile)"
echo "4. Fix Railway deployment if needed (see CHANGELOG-RAILWAY-FIX.md)"
echo "5. Deploy to Railway or your preferred platform"
echo ""
echo "Development commands:"
echo "  pnpm dev                 # Start development server"
echo "  pnpm build               # Build for production"
echo "  pnpm typecheck           # Run TypeScript checks"
echo "  pnpm run analyze:mp      # Analyze Magic Patterns"
echo ""
echo "Documentation:"
echo "  - IMPLEMENTATION-GUIDE.md  # Complete setup guide"
echo "  - CHANGELOG-RAILWAY-FIX.md # Railway deployment fix"
echo ""
print_success "Happy coding! 🚀"