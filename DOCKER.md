# Smart Choice - Docker Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ (for local development outside Docker)

### Start All Services

```bash
# Copy environment files (if not already done)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env 2>/dev/null || true

# Edit backend/.env with your Supabase credentials
# Edit frontend/.env if needed

# Start both services
docker compose up --build
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Backend Health**: http://localhost:5001/health

### Stop Services
```bash
docker compose down
```

---

## Production Deployment

### Option 1: Docker Compose (VPS/Cloud)

```bash
# Edit backend/.env with production credentials
# Edit frontend/.env with production API URL

docker compose -f docker-compose.prod.yml up --build -d
```

### Option 2: Render
1. Create a **Web Service** from your GitHub repo
2. Build command: `cd backend && npm ci && npm run build`
3. Start command: `cd backend && node dist/index.js`
4. Add a **Static Site** for frontend: `cd frontend && npm ci && npm run build`

### Option 3: Railway
```bash
railway init
railway up
```

### Option 4: Fly.io
```bash
fly launch
fly deploy
```

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   Frontend       │────▶│   Backend API     │
│   (Vite/React)   │     │   (Express/TS)    │
│   Port: 5173     │     │   Port: 5001      │
└─────────────────┘     └────────┬─────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Supabase DB     │
                       │   PostgreSQL      │
                       └──────────────────┘
```

### Service Details

#### Backend (`backend/Dockerfile`)
- **Base**: Node.js 20 Alpine
- **Multi-stage build**: Build → Runtime
- **Port**: 5001
- **Health check**: `/health` endpoint
- **Entrypoint**: Validates env vars before starting

#### Frontend (`frontend/Dockerfile`)
- **Base**: Node.js 20 Alpine (build) → Nginx 1.27 (runtime)
- **Port**: 80
- **SPA fallback**: All routes → index.html
- **API proxy**: `/api/*` → backend:5001
- **Gzip compression**: Enabled
- **Static asset caching**: 1 year

---

## Environment Variables

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `PORT` | No | Server port (default: 5001) |
| `FRONTEND_URL` | No | Frontend URL for CORS |
| `RAZORPAY_KEY_ID` | No | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | No | Razorpay key secret |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: http://localhost:5001) |

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker compose logs backend

# Verify environment
docker compose exec backend env

# Test health endpoint
curl http://localhost:5001/health
```

### Frontend won't start
```bash
# Check logs
docker compose logs frontend

# Verify build
docker compose logs frontend | grep -i error
```

### API requests failing
- Check that backend is running: `curl http://localhost:5001/health`
- Check CORS settings in backend/.env
- Verify frontend can reach backend: `docker compose exec frontend curl http://backend:5001/health`