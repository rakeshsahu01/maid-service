const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');

const router = express.Router();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      notes: {
        ...notes,
        userId: req.user.id,
        userEmail: req.user.email
      }
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ success: false, message: 'Payment order creation failed' });
  }
});

// Verify signature from client callback
router.post('/verify', auth, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { orderId: razorpay_order_id, paymentId: razorpay_payment_id }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Optional: Webhook (recommended for server-side confirmation)
// Configure the endpoint in Razorpay dashboard and set RAZORPAY_WEBHOOK_SECRET
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
    shasum.update(req.body.toString('utf8'));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body);
    // Handle event.payload.payment.entity.status, order_id, etc.
    res.json({ success: true });
  } catch (e) {
    console.error('Webhook error:', e);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
