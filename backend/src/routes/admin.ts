import { Router, Request, Response, NextFunction } from 'express';
import { orders, products, enquiries, categories } from '../config/database';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Dashboard overview stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allOrders = await orders.getAll();
    const allProducts = await products.getAll();
    const allEnquiries = await enquiries.getAll();

    const totalRevenue = allOrders.reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);
    const totalOrders = allOrders.length;
    const totalProducts = allProducts.length;
    const pendingOrders = allOrders.filter((o: any) => o.status === 'Confirmed' || o.status === 'Processing').length;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        pendingOrders,
        recentOrders: allOrders.slice(0, 5),
        recentEnquiries: allEnquiries.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin orders list
router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await orders.getAll();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
});

// Update order status
router.patch('/orders/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, paymentStatus } = req.body;
    const updated = await orders.updateStatus(req.params.id, status, paymentStatus);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// Customer enquiries
router.get('/enquiries', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await enquiries.getAll();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
});

// Update enquiry status
router.patch('/enquiries/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const updated = await enquiries.updateStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
