import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, getWishlist);

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
router.post('/', protect, [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Wishlist validation errors
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
      // Wishlist request body
  return addToWishlist(req, res);
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  const { productId } = req.params;

  // Validate productId
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }
  
  return removeFromWishlist(req, res);
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
router.delete('/', protect, clearWishlist);

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
router.get('/check/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Import Wishlist model here since we removed it from imports
    const Wishlist = (await import('../models/Wishlist.js')).default;
    const wishlist = await Wishlist.getWishlistByUser(req.user._id);
    const isInWishlist = wishlist.hasItem(productId);

    res.json({
      success: true,
      data: {
        isInWishlist
      }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking wishlist'
    });
  }
});

export default router;
