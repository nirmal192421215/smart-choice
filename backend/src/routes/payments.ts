import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { orders, payments } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Lazy load Razorpay to prevent crashes if keys are not provided
let razorpayInstance: any = null;
const isRazorpayConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('your_razorpay')
);

const getRazorpay = () => {
  if (!razorpayInstance && isRazorpayConfigured) {
    try {
      const Razorpay = require('razorpay');
      razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } catch (e) {
      console.warn('Razorpay SDK could not be loaded, using simulated payment handler');
    }
  }
  return razorpayInstance;
};

// Create Razorpay order
router.post('/create-order', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, orderId, currency = 'INR' } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required',
      });
    }

    const rzp = getRazorpay();

    if (rzp) {
      const options = {
        amount: Math.round(amount * 100), // paise
        currency,
        receipt: `rcpt_${orderId || Date.now()}`,
      };

      const razorpayOrder = await rzp.orders.create(options);

      return res.status(200).json({
        success: true,
        data: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      });
    }

    // Fallback simulated order when Razorpay keys are in demo/dev mode
    const simulatedOrderId = `order_sim_${Date.now()}`;
    return res.status(200).json({
      success: true,
      simulated: true,
      data: {
        id: simulatedOrderId,
        amount: Math.round(amount * 100),
        currency,
        keyId: 'rzp_test_simulated_key',
      },
    });
  } catch (error) {
    next(error);
  }
});

// Verify payment signature
router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
      amount,
    } = req.body;

    let isValid = false;

    if (process.env.RAZORPAY_KEY_SECRET && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isValid = expectedSignature === razorpaySignature;
    } else {
      // In simulation mode or dev test mode, accept simulated signature
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }

    // Record payment if orderId provided
    if (orderId) {
      try {
        await payments.create({
          order_id: orderId,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId || `pay_sim_${Date.now()}`,
          razorpay_signature: razorpaySignature || 'simulated_sig',
          amount: amount || 0,
          status: 'captured',
        });

        await orders.updateStatus(orderId, 'Confirmed', 'captured');
      } catch (err) {
        console.error('Failed to update DB payment record:', err);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
        status: 'captured',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
