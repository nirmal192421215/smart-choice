// ─────────────────────────────────────────────────────────────
// Smart Choice Environment Configuration Validator
// Validates required environment variables and provides clear error messages
// Run during application startup
// ─────────────────────────────────────────────────────────────

import dotenv from 'dotenv';

// Load environment variables
const env = dotenv.config().parsed || {};

// Required environment variables
const REQUIRED_ENV_VARS = {
  // Supabase Configuration
  SUPABASE_URL: {
    description: 'Supabase project URL',
    example: 'https://your-project.supabase.co',
    required: true,
  },
  SUPABASE_ANON_KEY: {
    description: 'Supabase anonymous (anon) key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    description: 'Supabase service role key (for admin operations)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  },

  // JWT Configuration
  JWT_SECRET: {
    description: 'Secret key for JWT tokens',
    example: 'your_super_secret_jwt_key_here',
    required: true,
  },
  JWT_EXPIRES_IN: {
    description: 'JWT expiration time (7d, 24h, 60m)',
    example: '7d',
    required: true,
  },

  // Razorpay Configuration
  RAZORPAY_KEY_ID: {
    description: 'Razorpay key ID',
    example: 'rzp_test_abcdef123456',
    required: true,
  },
  RAZORPAY_KEY_SECRET: {
    description: 'Razorpay key secret',
    example: 'your_razorpay_key_secret',
    required: true,
  },

  // Server Configuration
  PORT: {
    description: 'Server port',
    example: '5000',
    required: false,
  },

  FRONTEND_URL: {
    description: 'Frontend URL for CORS',
    example: 'http://localhost:5173',
    required: false,
  },

  // Global Rate Limiting
  RATE_LIMIT_WINDOW_MS: {
    description: 'Global rate limit window in milliseconds (15min = 900000)',
    example: '900000',
    required: false,
  },

  RATE_LIMIT_MAX_REQUESTS: {
    description: 'Global rate limit max requests per window',
    example: '100',
    required: false,
  },

  // Auth Rate Limiting
  AUTH_RATE_LIMIT_WINDOW_MS: {
    description: 'Auth endpoints rate limit window (15min = 900000)',
    example: '900000',
    required: false,
  },

  AUTH_RATE_LIMIT_MAX_REQUESTS: {
    description: 'Auth endpoints max requests per window (stricter)',
    example: '5',
    required: false,
  },

  // Payment Rate Limiting
  PAYMENT_RATE_LIMIT_WINDOW_MS: {
    description: 'Payment endpoints rate limit window (15min = 900000)',
    example: '900000',
    required: false,
  },

  PAYMENT_RATE_LIMIT_MAX_REQUESTS: {
    description: 'Payment endpoints max requests per window',
    example: '20',
    required: false,
  },

  // Admin Rate Limiting
  ADMIN_RATE_LIMIT_WINDOW_MS: {
    description: 'Admin endpoints rate limit window (15min = 900000)',
    example: '900000',
    required: false,
  },

  ADMIN_RATE_LIMIT_MAX_REQUESTS: {
    description: 'Admin endpoints max requests per window',
    example: '30',
    required: false,
  },

  // Cart Rate Limiting
  CART_RATE_LIMIT_WINDOW_MS: {
    description: 'Cart endpoints rate limit window (15min = 900000)',
    example: '900000',
    required: false,
  },

  CART_RATE_LIMIT_MAX_REQUESTS: {
    description: 'Cart endpoints max requests per window',
    example: '50',
    required: false,
  },

  // Order Rate Limiting
  ORDER_RATE_LIMIT_WINDOW_MS: {
    description: 'Order endpoints rate limit window (15min = 900000)',
    example: '900000',
    required: false,
  },

  ORDER_RATE_LIMIT_MAX_REQUESTS: {
    description: 'Order endpoints max requests per window',
    example: '30',
    required: false,
  },

  // Product Read Rate Limiting
  PRODUCT_READ_RATE_LIMIT_WINDOW_MS: {
    description: 'Product read endpoints rate limit window (15min = 900000)',
    example: '900000',
    required: false,
  },

  PRODUCT_READ_RATE_LIMIT_MAX_REQUESTS: {
    description: 'Product read endpoints max requests per window (generous)',
    example: '200',
    required: false,
  },

  // Product Write Rate Limiting
  PRODUCT_WRITE_RATE_LIMIT_WINDOW_MS: {
    description: 'Product write endpoints rate limit window (15min = 900000)',
    example: '900000',
    required: false,
  },

  PRODUCT_WRITE_RATE_LIMIT_MAX_REQUESTS: {
    description: 'Product write endpoints max requests per window (stricter)',
    example: '20',
    required: false,
  },

  // CSRF
  CSRF_SECRET: {
    description: 'Secret for CSRF token signing (optional, uses random if not set)',
    example: 'your_csrf_secret_here',
    required: false,
  },

  // Email Configuration (optional)
  SMTP_HOST: {
    description: 'SMTP host',
    example: 'smtp.gmail.com',
    required: false,
  },

  SMTP_PORT: {
    description: 'SMTP port',
    example: '587',
    required: false,
  },

  SMTP_USER: {
    description: 'SMTP username',
    example: 'your_email@gmail.com',
    required: false,
  },

  SMTP_PASS: {
    description: 'SMTP password or app password',
    example: 'your_app_password',
    required: false,
  },

  EMAIL_FROM: {
    description: 'Email from address',
    example: 'Smart Choice <noreply@smartchoice.in>',
    required: false,
  },

  // Logging
  LOG_LEVEL: {
    description: 'Log level (info, warn, error, debug)',
    example: 'info',
    required: false,
  },
};

// Validation results interface
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config?: Partial<typeof env>;
}

// Validate environment variables
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for dotenv file not found
  if (!env || Object.keys(env).length === 0) {
    errors.push('[ERROR] .env file not found. Copy .env.example to .env and fill in values.');
  }

  // Check required environment variables
  for (const [key, config] of Object.entries(REQUIRED_ENV_VARS)) {
    if (config.required) {
      const value = env[key];
      if (!value) {
        errors.push(`[ERROR] Missing required environment variable: ${key}`);
      } else if (key.includes('URL') && !value.startsWith('http')) {
        warnings.push(`[WARN] Environment variable ${key} should start with 'http://' or 'https://'`);
      } else if (key.includes('KEY') && value.length < 20) {
        warnings.push(`[WARN] Environment variable ${key} appears to be a placeholder (too short)`);
      }
    }
  }

  // Environment-specific validation
  const nodeEnv = env.NODE_ENV || 'development';

  // Validate SUPABASE_URL format
  const supabaseUrl = env.SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('http')) {
    errors.push('[ERROR] SUPABASE_URL must start with http:// or https://');
  }

  // Validate Razorpay keys in production
  if (nodeEnv === 'production') {
    if (!env.RAZORPAY_KEY_ID) {
      errors.push('[ERROR] RAZORPAY_KEY_ID is required in production');
    }
    if (!env.RAZORPAY_KEY_SECRET) {
      errors.push('[ERROR] RAZORPAY_KEY_SECRET is required in production');
    }
    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      warnings.push('[WARN] SUPABASE_SERVICE_ROLE_KEY not set in production (may cause admin operations to fail)');
    }
  }

  // Validate JWT_SECRET length in production
  if (nodeEnv === 'production' && env.JWT_SECRET && env.JWT_SECRET.length < 32) {
    warnings.push('[WARN] JWT_SECRET should be at least 32 characters for production');
  }

  // Validate port
  if (env.PORT) {
    const port = parseInt(env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push('[ERROR] PORT must be a valid port number (1-65535)');
    }
  }

  // Validate rate limits
  if (env.RATE_LIMIT_WINDOW_MS) {
    const window = parseInt(env.RATE_LIMIT_WINDOW_MS);
    if (isNaN(window) || window < 1000) {
      warnings.push('[WARN] RATE_LIMIT_WINDOW_MS should be at least 1000ms (1 second)');
    }
  }

  if (env.RATE_LIMIT_MAX_REQUESTS) {
    const max = parseInt(env.RATE_LIMIT_MAX_REQUESTS);
    if (isNaN(max) || max < 1) {
      errors.push('[ERROR] RATE_LIMIT_MAX_REQUESTS must be a positive number');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config: env as Partial<typeof env>,
  };
}

// Print validation results
function printValidationResults(result: ValidationResult): void {
  console.log('\n[INFO] Environment Validation Results');
  console.log('==============================');

  if (result.valid) {
    console.log('[OK] Environment configuration is valid!');
    console.log('\nEnvironment Variables:');
    for (const [key, value] of Object.entries(result.config || {})) {
      if (!value || value.includes('your_') || value.includes('example') || value.includes('placeholder')) {
        continue; // Skip placeholder values
      }
      console.log(`   ${key}: ${key.includes('KEY') || key.includes('PASS') || key.includes('SECRET') ? '***' : value}`);
    }
  } else {
    console.log('[ERROR] Environment configuration validation failed:');
    for (const error of result.errors) {
      console.log('   ' + error);
    }
  }

  if (result.warnings.length > 0) {
    console.log('\n[WARN] Warnings:');
    for (const warning of result.warnings) {
      console.log('   ' + warning);
    }
  }

  console.log('\n[INFO] Next Steps:');
  console.log('   1. Copy .env.example to .env');
  console.log('   2. Replace placeholder values with actual values');
  console.log('   3. Restart the application');
  console.log('   4. Run: npm run seed (if using seed script)');

  if (!result.valid) {
    console.log('\n[ERROR] Please fix the environment variables and try again.');
    process.exit(1);
  }
}

// Validate and exit if invalid
export function validateEnvironmentOrExit(): void {
  const result = validateEnvironment();
  printValidationResults(result);

  if (!result.valid) {
    process.exit(1);
  }
}

export default validateEnvironmentOrExit;
export type { ValidationResult };