import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import { validateEnvironment } from './config/validate-env';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import authRouter from './routes/auth';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import paymentsRouter from './routes/payments';
import adminRouter from './routes/admin';
import enquiriesRouter from './routes/enquiries';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';
import csrfProtection from './middleware/csrf';
import {
  globalLimiter,
  authLimiter,
  paymentLimiter,
  adminLimiter,
  cartLimiter,
  orderLimiter,
  productReadLimiter,
  productWriteLimiter,
} from './middleware/rateLimiter';

dotenv.config();

// Validate environment variables before starting (skip in tests)
if (process.env.NODE_ENV !== 'test') {
  validateEnvironment();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Helmet sets various HTTP headers for security best practices
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disable CSP for API; frontend handles its own
}));

// CORS — restrict origin in production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
}));

// Compression and body parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CSRF protection — sets CSRF cookie on GET, validates on state-changing methods
app.use(csrfProtection);

// Global rate limiter — fallback for all API routes
app.use('/api/', globalLimiter);

// Per-route rate limiters
app.use('/api/auth', authLimiter);
app.use('/api/payments', paymentLimiter);
app.use('/api/admin', adminLimiter);
app.use('/api/cart', cartLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/products', productReadLimiter, productWriteLimiter);

// Health check endpoint — exempt from CSRF and global rate limiting
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Smart Choice API',
  });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/enquiries', enquiriesRouter);

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

// Test database connection
const testConnection = async () => {
  try {
    const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Database connection successful');
  } catch (err: any) {
    console.warn('⚠️ Supabase connection pending or credentials not yet active:', err?.message || err);
    console.warn('ℹ️ Running in development mode with local fallback responses.');
  }
};

// Start server
const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔧 Health Check: http://localhost:${PORT}/health`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
