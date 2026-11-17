import { Router, Request, Response, NextFunction } from 'express';
import type { Request as ExpressRequest } from 'express';
import { products } from '../config/database';
import { validateRequest, productValidators, productQueryValidator } from '../middleware/validators';

const router = Router();

// Get all products with optional filters
router.get('/', validateRequest(productQueryValidator), async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    const productsList = await products.getAll();

    let filtered = productsList;

    // Filter by category
    if (category) {
      filtered = filtered.filter((p: any) => p.category === category);
    }

    // Search
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Price filtering
    if (minPrice) {
      filtered = filtered.filter(
        (p: any) => p.price >= Number(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (p: any) => p.price <= Number(maxPrice)
      );
    }

    // Sorting
    const sort = sortBy as string || 'created_at';
    filtered.sort((a: any, b: any) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
});

// Get single product by ID
router.get('/:id', async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const product = await products.getById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Get product by slug
router.get('/slug/:slug', async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const product = await products.getBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Get products by category
router.get('/category/:category', async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const productsList = await products.getByCategory(req.params.category);

    res.status(200).json({
      success: true,
      count: productsList.length,
      data: productsList,
    });
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post('/', validateRequest(productValidators), async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const newProduct = await products.create(data);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
});

// Update product (admin only)
router.put('/:id', validateRequest(productValidators), async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await products.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
router.delete('/:id', async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    await products.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;