# ─────────────────────────────────────────────────────────────
# Smart Choice Backend Dockerfile
# Multi-stage build for optimal production image size
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (pg, bcryptjs)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    musl-dev

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDeps for TypeScript compilation)
RUN npm ci

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript to JavaScript
RUN npm run build

# Prune dev dependencies for smaller image
RUN npm prune --production

# ── Stage 2: Production Runtime ───────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Install runtime dependencies for native modules (pg, bcryptjs)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    musl-dev \
    dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy environment files
COPY .env* ./

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD node -e "fetch('http://localhost:5001/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Expose port
EXPOSE 5001

# Start the server
ENTRYPOINT ["/usr/bin/dumb-init", "/app/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]