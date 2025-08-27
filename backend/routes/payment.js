import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
router.post('/create-payment-intent', protect, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.body;

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating payment intent'
    });
  }
});

// @desc    Confirm payment
// @route   POST /api/payment/confirm
// @access  Private
router.post('/confirm', protect, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, paymentIntentId } = req.body;

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm payment for this order'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order payment status
      order.paymentStatus = 'completed';
      order.paymentDetails = {
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        amount: order.total,
        currency: 'INR',
        paymentDate: new Date()
      };
      order.orderStatus = 'confirmed';
      
      await order.save();

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: {
          order
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming payment'
    });
  }
});

// @desc    Stripe webhook
// @route   POST /api/payment/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
    default:
              // Unhandled event type
  }

  res.json({ received: true });
});

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);

    if (order) {
      order.paymentStatus = 'completed';
      order.paymentDetails = {
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        amount: order.total,
        currency: 'INR',
        paymentDate: new Date()
      };
      order.orderStatus = 'confirmed';
      
      await order.save();
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

// Handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);

    if (order) {
      order.paymentStatus = 'failed';
      order.paymentDetails = {
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        amount: order.total,
        currency: 'INR'
      };
      
      await order.save();
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

// @desc    Get payment methods
// @route   GET /api/payment/methods
// @access  Private
router.get('/methods', protect, async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay securely with your card',
        icon: '💳'
      },
      {
        id: 'razorpay',
        name: 'UPI & Digital Wallets',
        description: 'Pay with UPI, Paytm, PhonePe, etc.',
        icon: '📱'
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        icon: '💰'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Transfer money directly to our account',
        icon: '🏦'
      }
    ];

    res.json({
      success: true,
      data: {
        paymentMethods
      }
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment methods'
    });
  }
});

export default router;
