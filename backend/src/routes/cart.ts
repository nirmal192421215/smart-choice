import { Router, Request, Response, NextFunction } from 'express';
import { coupons } from '../config/database';
import { validateRequest, cartItemArrayValidator } from '../middleware/validators';

const router = Router();

// Validate cart and apply discount
router.post('/validate', validateRequest(cartItemArrayValidator), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, couponCode } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Cart items array is required',
      });
    }

    const subtotal = items.reduce((sum: number, item: any) => {
      const price = item.salePrice || item.price || 0;
      return sum + price * (item.quantity || 1);
    }, 0);

    // Free shipping on orders over ₹1000
    const shippingCharges = subtotal >= 1000 ? 0 : 99;

    let discount = 0;
    let couponDetails = null;

    if (couponCode) {
      const couponResult = await coupons.validate(couponCode.toUpperCase().trim());
      if (couponResult.valid && couponResult.coupon) {
        couponDetails = couponResult.coupon;
        if (couponDetails.discountType === 'percentage') {
          discount = Math.round((subtotal * couponDetails.discountValue) / 100);
          if (couponDetails.maxDiscount && discount > couponDetails.maxDiscount) {
            discount = couponDetails.maxDiscount;
          }
        } else {
          discount = couponDetails.discountValue;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discount + shippingCharges);

    res.status(200).json({
      success: true,
      data: {
        itemCount: items.length,
        subtotal,
        shippingCharges,
        discount,
        couponApplied: !!couponDetails,
        totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Validate promo coupon
router.post('/apply-coupon', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Coupon code is required',
      });
    }

    const result = await coupons.validate(code.toUpperCase().trim());

    if (!result.valid || !result.coupon) {
      return res.status(400).json({
        success: false,
        error: result.reason || 'Invalid or expired coupon code',
      });
    }

    const coupon = result.coupon;
    if (cartTotal && coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round(((cartTotal || 0) * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
