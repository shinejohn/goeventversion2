#!/bin/bash
# Railway Deployment Script for When's The Fun
# Handles the monorepo deployment configuration

set -e

echo "🚂 Deploying When's The Fun to Railway..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Backup original railway.toml
if [ -f "railway.toml" ] && [ ! -f "railway.toml.backup" ]; then
    print_status "Backing up original railway.toml"
    cp railway.toml railway.toml.backup
    print_success "Backup created: railway.toml.backup"
fi

# Check current railway.toml configuration
if grep -q 'startCommand = "pnpm start"' railway.toml; then
    print_warning "Detected incorrect Railway configuration for monorepo"
    print_status "Applying Railway monorepo fix..."
    
    # Update railway.toml with correct monorepo command
    cat > railway.toml << 'EOF'
[build]
builder = "nixpacks"
buildCommand = "pnpm install && pnpm build"

[deploy]
startCommand = "pnpm --filter web start"
healthcheckPath = "/health"
healthcheckTimeout = 300

[environment]
NODE_ENV = "production"
PORT = { fromService = "web" }
EOF
    print_success "Updated railway.toml with monorepo-compatible configuration"
else
    print_success "Railway configuration already looks correct"
fi

# Validate build process
print_status "Validating build process..."
pnpm run build
if [ $? -ne 0 ]; then
    print_error "Build failed - cannot deploy"
    exit 1
fi
print_success "Build validation passed"

# Check for Railway CLI
if command -v railway &> /dev/null; then
    print_status "Railway CLI found, attempting deployment..."
    
    # Deploy to Railway
    railway up
    
    if [ $? -eq 0 ]; then
        print_success "🎉 Deployment completed successfully!"
    else
        print_error "Deployment failed"
        print_error "Check Railway logs for details"
        exit 1
    fi
else
    print_warning "Railway CLI not found"
    print_status "To deploy manually:"
    echo "1. Install Railway CLI: npm install -g @railway/cli"
    echo "2. Login: railway login"
    echo "3. Link project: railway link"
    echo "4. Deploy: railway up"
    echo ""
    print_status "Or push to GitHub if connected to Railway GitHub app"
fi

# Show final configuration
echo ""
print_status "Final Railway configuration:"
cat railway.toml

echo ""
print_success "Railway deployment script completed!"
print_status "If deployment fails, check CHANGELOG-RAILWAY-FIX.md for troubleshooting"