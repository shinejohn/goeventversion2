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
