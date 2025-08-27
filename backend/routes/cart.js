import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  applyCoupon, 
  removeCoupon 
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, getCart);

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid product ID format');
      }
      return true;
    }),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('variant')
    .optional()
    .custom((value) => {
      if (value !== undefined && value !== null && typeof value !== 'object') {
        throw new Error('Variant must be an object');
      }
      return true;
    })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  return addToCart(req, res);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', protect, [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be 0 or greater'),
  body('variant')
    .optional()
    .custom((value) => {
      if (value !== undefined && value !== null && typeof value !== 'object') {
        throw new Error('Variant must be an object');
      }
      return true;
    })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  return updateCartItem(req, res);
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
router.post('/coupon', protect, [
  body('code')
    .notEmpty()
    .withMessage('Coupon code is required')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  return applyCoupon(req, res);
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
router.delete('/coupon', protect, removeCoupon);

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  
  // Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }
  
  return removeFromCart(req, res);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, clearCart);

// @desc    Clean up cart items (for debugging)
// @route   POST /api/cart/cleanup
// @access  Private
router.post('/cleanup', protect, async (req, res) => {
  try {
    const cart = await Cart.getCartByUser(req.user._id);
    await cart.cleanupInvalidItems();
    
    res.json({
      success: true,
      message: 'Cart cleaned up successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Cleanup cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cleaning up cart'
    });
  }
});

export default router;
