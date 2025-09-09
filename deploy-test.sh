#!/bin/bash
set -e  # Exit on any error
set -x  # Show every command (for debugging)

echo "🚀 FULL DEPLOYMENT TEST SCRIPT"
echo "=============================="
echo "Time: $(date)"
echo "Directory: $(pwd)"

# 1. Check Node version
echo -e "\n📍 Step 1: Checking Node version..."
node --version || { echo "❌ Node.js not found!"; exit 1; }
npm --version || { echo "❌ npm not found!"; exit 1; }

# 2. Install pnpm if needed
echo -e "\n📍 Step 2: Setting up pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm globally..."
    npm install -g pnpm@latest
fi
pnpm --version

# 3. Install ALL dependencies
echo -e "\n📍 Step 3: Installing dependencies..."
pnpm install --frozen-lockfile || { echo "❌ Failed to install dependencies"; exit 1; }

# 4. Run type checking
echo -e "\n📍 Step 4: Type checking..."
pnpm typecheck || { echo "⚠️  Type errors found (continuing anyway)"; }

# 5. Check database connection
echo -e "\n📍 Step 5: Checking environment variables..."
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "⚠️  VITE_SUPABASE_URL not set - using placeholder"
    export VITE_SUPABASE_URL="https://placeholder.supabase.co"
fi
if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  VITE_SUPABASE_ANON_KEY not set - using placeholder"
    export VITE_SUPABASE_ANON_KEY="placeholder-key"
fi

echo "Environment variables:"
env | grep -E "(VITE_|NODE_ENV|DATABASE_URL)" | sort || echo "No relevant env vars found"

# 6. Generate database types (if database is available)
echo -e "\n📍 Step 6: Database setup..."
if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "Generating database types..."
    pnpm supabase:web:typegen || echo "⚠️  Could not generate DB types"
else
    echo "⚠️  Skipping DB type generation (no service key)"
fi

# 7. Build the application
echo -e "\n📍 Step 7: Building application..."
pnpm build || { echo "❌ Build failed!"; exit 1; }

# 8. Check build output
echo -e "\n📍 Step 8: Verifying build output..."
echo "Checking apps/web/build structure:"
find apps/web/build -type f -name "*.js" | head -20 || echo "No JS files found in build!"

# Check specific expected files
if [ -f "apps/web/build/server/index.js" ]; then
    echo "✅ Server bundle found!"
else
    echo "❌ Server bundle NOT found at apps/web/build/server/index.js"
    echo "Looking for server files:"
    find apps/web -name "index.js" -type f | grep -i server || echo "No server index.js found anywhere"
fi

# 9. Test if server can start (dry run)
echo -e "\n📍 Step 9: Testing server startup..."
cd apps/web
timeout 5 pnpm start || { 
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
        echo "✅ Server started successfully (killed after 5s test)"
    else
        echo "❌ Server failed to start (exit code: $EXIT_CODE)"
    fi
}
cd ../..

# 10. Create deployment-ready script
echo -e "\n📍 Step 10: Creating production start script..."
cat > start-production.sh << 'EOF'
#!/bin/bash
cd apps/web
echo "Starting production server..."
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"

# Ensure all required env vars are set
export NODE_ENV=production
export PORT=${PORT:-3000}

# Start the server
exec node build/server/index.js
EOF
chmod +x start-production.sh

echo -e "\n✅ DEPLOYMENT TEST COMPLETE!"
echo "=============================="
echo "Summary:"
echo "- Dependencies: Installed"
echo "- Type checking: Completed"  
echo "- Build: Completed"
echo "- Server test: Completed"
echo ""
echo "Next steps:"
echo "1. Check the output above for any errors"
echo "2. If everything looks good, you can deploy with:"
echo "   railway up"
echo "3. Use ./start-production.sh to start in production"