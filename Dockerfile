# Use Node.js 20 Alpine image for smaller size
FROM node:20-alpine AS base

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Install dependencies needed for node-gyp and canvas
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev giflib-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy all package.json files to preserve workspace structure
COPY apps/*/package.json apps/
COPY packages/*/package.json packages/
COPY tooling/*/package.json tooling/

# Install production dependencies only
# Using --no-frozen-lockfile to handle lockfile discrepancies in CI
RUN pnpm install --no-frozen-lockfile --prod

# Build stage
FROM base AS builder
WORKDIR /app

# Copy all source code
COPY . .

# Install all dependencies (including dev) for building
RUN pnpm install --no-frozen-lockfile

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/build ./apps/web/build
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nodejs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy node_modules from base (production only)
COPY --from=base --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nodejs:nodejs /app/apps/web/node_modules ./apps/web/node_modules

# Switch to non-root user
USER nodejs

# Expose the port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "--filter", "web", "start"]