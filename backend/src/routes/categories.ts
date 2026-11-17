import { Router, Request, Response, NextFunction } from 'express';
import { categories } from '../config/database';
import { validateRequest, categoryValidators } from '../middleware/validators';

const router = Router();

// Get all categories
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoriesList = await categories.getAll();

    res.status(200).json({
      success: true,
      count: categoriesList.length,
      data: categoriesList,
    });
  } catch (error) {
    next(error);
  }
});

// Create category (admin only)
router.post('/', validateRequest(categoryValidators), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    // TODO: Implement category creation in database functions
    res.status(201).json({
      success: true,
      message: 'Category created (placeholder)',
    });
  } catch (error) {
    next(error);
  }
});

export default router;