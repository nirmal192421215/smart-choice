#!/bin/sh
# ─────────────────────────────────────────────────────────────
# Smart Choice Backend Docker Entrypoint
# Validates required environment variables before starting
# ─────────────────────────────────────────────────────────────

set -e

echo "🚀 Smart Choice Backend Starting..."
echo "   Node.js version: $(node --version)"
echo "   Environment: ${NODE_ENV:-development}"

# ── Validate required environment variables ──────────────────
REQUIRED_VARS="SUPABASE_URL SUPABASE_ANON_KEY"

MISSING=0
for var in $REQUIRED_VARS; do
    if [ -z "$(eval echo \$$var)" ]; then
        echo "⚠️  Warning: $var is not set"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    echo "⚠️  Running with placeholder Supabase credentials (fallback mode)"
    echo "   Set SUPABASE_URL and SUPABASE_ANON_KEY for full functionality"
fi

# ── Check if dist exists ─────────────────────────────────────
if [ ! -f "dist/index.js" ]; then
    echo "❌ Error: dist/index.js not found. Did you build the TypeScript?"
    exit 1
fi

# ── Start the server ─────────────────────────────────────────
echo "✅ Starting Smart Choice API on port ${PORT:-5001}..."
exec node dist/index.js