import { Router, Request, Response, NextFunction } from 'express';
import { orders, orderItems, products } from '../config/database';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { sendWhatsAppMessage, buildOrderNotification } from '../services/greenapi';

const router = Router();

// Get orders for authenticated user
router.get('/my-orders', authenticateUser, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const userOrders = await orders.getByUserId(req.userId);
    res.status(200).json({
      success: true,
      count: userOrders.length,
      data: userOrders,
    });
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orders.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Create new order
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      subtotal,
      shippingCharges,
      discount,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required order fields (items, shippingAddress)',
      });
    }

    const orderNumber = `SC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    let newOrder: any = null;
    try {
      newOrder = await orders.create({
        user_id: userId || null,
        items,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        payment_status: paymentMethod === 'cod' ? 'authorized' : 'pending',
        status: 'Confirmed',
      });

      if (items && items.length > 0) {
        const formattedItems = items.map((item: any) => ({
          order_id: newOrder.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          selected_color: item.color,
          selected_variant: item.variantId || null,
          custom_destination: item.customDestinationUrl || null,
        }));
        await orderItems.createBulk(formattedItems);
      }
    } catch (dbErr) {
      console.warn('[orders] Database save failed (using fallback):', (dbErr as Error)?.message || dbErr);
      newOrder = {
        id: `ord_${Date.now()}`,
        order_number: orderNumber,
        status: 'Confirmed',
        total_amount: totalAmount,
      };
    }

    // Push the order details to WhatsApp via GREEN-API.
    // Non-blocking: a failure here never fails the order itself.
    try {
      const enrichedItems = await Promise.all(
        (items as any[]).map(async (item) => {
          let productName = item.name || item.productName;
          if (!productName && item.productId) {
            try {
              const product = await products.getById(item.productId);
              productName = product?.name;
            } catch {
              productName = item.productId;
            }
          }
          return {
            productName,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price ?? item.salePrice,
            selectedColor: item.color,
            selectedVariant: item.variantId,
            customDestination: item.customDestinationUrl,
          };
        })
      );

      const message = buildOrderNotification({
        orderNumber,
        status: newOrder.status,
        paymentStatus: newOrder.payment_status,
        totalAmount: newOrder.total_amount ?? totalAmount,
        shippingAddress,
        items: enrichedItems,
      });

      await sendWhatsAppMessage(message);
    } catch (notifyErr) {
      console.error('[orders] WhatsApp notification failed:', (notifyErr as Error)?.message || notifyErr);
    }

    res.status(201).json({
      success: true,
      data: {
        ...newOrder,
        orderNumber,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update order status (internal/webhook/admin)
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
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

export default router;
