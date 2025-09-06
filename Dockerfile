# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Install dependencies needed for node-gyp and canvas
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev giflib-dev

WORKDIR /app

# Copy all files
COPY . .

# Debug: List marketing docs directory
RUN ls -la /app/apps/web/app/routes/marketing/docs/

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Debug: List again after install
RUN ls -la /app/apps/web/app/routes/marketing/docs/

# Generate types and build with SSR enabled
RUN pnpm --filter web react-router:typegen
RUN pnpm --filter web build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files first
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nodejs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nodejs:nodejs /app/turbo.json ./turbo.json

# Copy all workspace package.json files to maintain structure
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages
COPY --from=builder --chown=nodejs:nodejs /app/tooling ./tooling

# Install production dependencies only
RUN pnpm install --no-frozen-lockfile --prod --filter web...

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/build ./apps/web/build
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/public ./apps/web/public

# Note: Environment variables should be provided at runtime via deployment platform
# not copied from build stage

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application using the root package.json script
CMD ["pnpm", "start"]