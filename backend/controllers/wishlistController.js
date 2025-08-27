import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlistByUser(req.user._id);

    res.json({
      success: true,
      data: {
        wishlist
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist'
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Adding to wishlist

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      // Product not found or inactive
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.getWishlistByUser(req.user._id);

    // Check if item already exists in wishlist
    if (wishlist.hasItem(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Item already exists in wishlist'
      });
    }

    // Add item to wishlist
    await wishlist.addItem(productId);

    // Get updated wishlist with populated product details
    const updatedWishlist = await Wishlist.getWishlistByUser(req.user._id);

    res.json({
      success: true,
      message: 'Item added to wishlist successfully',
      data: {
        wishlist: updatedWishlist
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to wishlist'
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get wishlist
    const wishlist = await Wishlist.getWishlistByUser(req.user._id);

    // Remove item (removeItem method handles the case where item doesn't exist)
    await wishlist.removeItem(productId);

    // Get updated wishlist
    const updatedWishlist = await Wishlist.getWishlistByUser(req.user._id);

    res.json({
      success: true,
      message: 'Item removed from wishlist successfully',
      data: {
        wishlist: updatedWishlist
      }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from wishlist'
    });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlistByUser(req.user._id);
    await wishlist.clearWishlist();

    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: {
        wishlist
      }
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing wishlist'
    });
  }
};
