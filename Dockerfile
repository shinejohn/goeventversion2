# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Install dependencies needed for node-gyp and canvas
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev giflib-dev

WORKDIR /app

# Copy all files
COPY . .

# Install all dependencies and build
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

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

# Copy any runtime config files that might be needed
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/.env* ./apps/web/ || true
COPY --from=builder --chown=nodejs:nodejs /app/.env* ./ || true

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "--filter", "web", "start"]