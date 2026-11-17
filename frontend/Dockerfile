# ─────────────────────────────────────────────────────────────
# Smart Choice Frontend Dockerfile
# Multi-stage build: Vite build → Nginx static serving
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm/yarn if needed
RUN corepack enable

# Copy package files first for layer caching
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY index.html ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY public ./public

# Build the production bundle
RUN npm run build

# ── Stage 2: Production Runtime (Nginx) ───────────────────────
FROM nginx:1.27-alpine AS runtime

WORKDIR /usr/share/nginx/html

# Copy built static files from builder
COPY --from=builder /app/dist ./

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom error page
COPY public/404.html ./404.html 2>/dev/null || true

# Copy .dockerignore for runtime
COPY public/_redirects ./_redirects 2>/dev/null || true

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]