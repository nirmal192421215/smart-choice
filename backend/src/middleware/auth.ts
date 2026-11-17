import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';

// Extend Express Request type
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Middleware to verify Supabase JWT token
export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    req.userId = user.id;

    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // Create profile if it doesn't exist
      const { data: newProfile } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          role: 'customer',
        }])
        .select()
        .single();

      req.userRole = newProfile?.role || 'customer';
    } else {
      req.userRole = profile.role;
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

// Middleware to require admin role
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

// Middleware to require customer role
export const requireCustomer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'customer') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Customer privileges required.',
    });
  }

  next();
};

export default authenticateUser;