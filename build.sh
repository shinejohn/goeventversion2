#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Ensure we're using the right Node version
echo "Node version: $(node --version)"

# Enable corepack and prepare pnpm
echo "📦 Setting up pnpm..."
corepack enable
corepack prepare pnpm@10.15.0 --activate

# Verify pnpm is available
echo "pnpm version: $(pnpm --version)"

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install --frozen-lockfile --prefer-offline

# Build the application
echo "🔨 Building application..."
pnpm build

echo "✅ Build completed successfully!"