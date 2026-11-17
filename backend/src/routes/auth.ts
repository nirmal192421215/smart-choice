import { Router, Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { validateRequest, emailValidator } from '../middleware/validators';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Sign in with Supabase
router.post('/signin', validateRequest(emailValidator), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Sign in failed',
      });
    }

    if (!data.session) {
      return res.status(400).json({
        success: false,
        error: 'No session created',
      });
    }

    // Get or create user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      await supabaseAdmin
        .from('profiles')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          role: 'customer',
        }]);
    }

    res.status(200).json({
      success: true,
      data: {
        user: data.user,
        profile: profile || { id: data.user.id, email: data.user.email, role: 'customer' },
        session: data.session,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Sign up with Supabase
router.post('/signup', validateRequest(emailValidator), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
        },
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Sign up failed',
      });
    }

    if (data.user) {
      // Create user profile
      await supabaseAdmin
        .from('profiles')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          name: fullName || email.split('@')[0],
          role: 'customer',
        }]);
    }

    res.status(201).json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Sign out
router.post('/signout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Sign out failed',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateUser, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return res.status(401).json({
        success: false,
        error: 'No valid session',
      });
    }

    res.status(200).json({
      success: true,
      data: { session: data.session },
    });
  } catch (error) {
    next(error);
  }
});

export default router;