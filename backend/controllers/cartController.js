import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.getCartByUser(req.user._id);
    
    // Clean up any invalid items
    await cart.cleanupInvalidItems();
    
    // Ensure cart summary is calculated correctly
    const summary = cart.getSummary();
    cart.summary = summary; // Override virtual with calculated summary

    // Cart fetched successfully

    res.json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variant, selectedBundleItems } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // For products with bundle items, validate selected items
    if (product.hasBundleItems) {
      if (!selectedBundleItems || selectedBundleItems.length !== product.bundleSize) {
        return res.status(400).json({
          success: false,
          message: `Please select exactly ${product.bundleSize} items for this product`
        });
      }
      
      // Validate that all selected items exist in the bundle
      const validItemIds = product.bundleItems.map(item => item._id?.toString() || `${item.category}-${item.name}`);
      const allValid = selectedBundleItems.every(itemId => validItemIds.includes(itemId));
      
      if (!allValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bundle item selection'
        });
      }
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    // Get or create cart
    let cart = await Cart.getCartByUser(req.user._id);

    // Calculate price (use variant price if available)
    let price = product.price;
    if (variant && variant.price) {
      price = variant.price;
    }

    // For products with bundle items, calculate price based on selected items
    if (product.hasBundleItems && selectedBundleItems) {
      const selectedItemsData = product.bundleItems.filter(item => 
        selectedBundleItems.includes(item._id?.toString() || `${item.category}-${item.name}`)
      );
      price = selectedItemsData.reduce((sum, item) => sum + item.price, 0);
    }

    // Add item to cart with bundle information
    await cart.addItem(productId, quantity, variant, price, selectedBundleItems);

    // Get updated cart with populated product details
    const updatedCart = await Cart.getCartByUser(req.user._id);
    
    // Ensure cart summary is calculated correctly
    const summary = updatedCart.getSummary();
    updatedCart.summary = summary;

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: updatedCart
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to cart'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, variant } = req.body;

    // Get cart
    const cart = await Cart.getCartByUser(req.user._id);

    // Check if product exists in cart
    const cartItem = cart.items.find(item => {
      // Handle both populated and unpopulated product references
      if (!item.product) return false;
      const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
      return itemProductId === productId &&
             JSON.stringify(item.variant) === JSON.stringify(variant || null);
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check stock if quantity is being increased
    if (quantity > cartItem.quantity) {
      const product = await Product.findById(productId);
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available'
        });
      }
    }

    // Update quantity
    await cart.updateItemQuantity(productId, quantity, variant);

    // Get updated cart
    const updatedCart = await Cart.getCartByUser(req.user._id);
    
    // Ensure cart summary is calculated correctly
    const summary = updatedCart.getSummary();
    updatedCart.summary = summary;

    res.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
      data: {
        cart: updatedCart
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variant } = req.query;

    // Get cart
    const cart = await Cart.getCartByUser(req.user._id);

    // Remove item (removeItem method handles the case where item doesn't exist)
    await cart.removeItem(productId, variant ? JSON.parse(variant) : null);

    // Get updated cart
    const updatedCart = await Cart.getCartByUser(req.user._id);
    
    // Ensure cart summary is calculated correctly
    const summary = updatedCart.getSummary();
    updatedCart.summary = summary;

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart: updatedCart
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from cart'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.getCartByUser(req.user._id);
    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    // Get cart
    const cart = await Cart.getCartByUser(req.user._id);
    
    // Check if cart has items
    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply coupon to empty cart'
      });
    }

    // Import Coupon model here to avoid circular dependency
    const Coupon = (await import('../models/Coupon.js')).default;

    // Find and validate coupon
    const couponResult = await Coupon.findValidCoupon(code, req.user._id);
    if (!couponResult.valid) {
      return res.status(400).json({
        success: false,
        message: couponResult.message
      });
    }

    const coupon = couponResult.coupon;

    // Calculate discount
    const cartSummary = cart.getSummary(); // Use method instead of virtual for debugging
    
    const discountResult = coupon.calculateDiscount(cartSummary.subtotal);
    
    if (!discountResult.valid) {
      return res.status(400).json({
        success: false,
        message: discountResult.message
      });
    }

    // Check if the same coupon is already applied
    if (cart.coupon && cart.coupon.code === coupon.code) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is already applied to your cart'
      });
    }
    
    // Remove any existing coupon first
    if (cart.coupon) {
      await cart.removeCoupon();
    }
    
    // Apply coupon
    await cart.applyCoupon(
      coupon.code,
      discountResult.discountAmount,
      coupon.type
    );

    // Get updated cart
    const updatedCart = await Cart.getCartByUser(req.user._id);
    const updatedCartSummary = updatedCart.getSummary();

    // Ensure cart summary is calculated correctly
    const summary = updatedCart.getSummary();
    updatedCart.summary = summary;

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        cart: updatedCart,
        discount: discountResult.discountAmount
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying coupon'
    });
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
export const removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.getCartByUser(req.user._id);
    
    if (!cart.coupon) {
      return res.status(400).json({
        success: false,
        message: 'No coupon applied to cart'
      });
    }
    
    // Remove the coupon first
    await cart.removeCoupon();

    // Get fresh cart data without running cleanup (to avoid validation errors)
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images stock isActive'
    });
    
    // Ensure cart summary is calculated correctly
    const summary = updatedCart.getSummary();
    updatedCart.summary = summary;

    // Coupon removed successfully

    res.json({
      success: true,
      message: 'Coupon removed successfully',
      data: {
        cart: updatedCart
      }
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Cart validation error. Please refresh your cart.'
      });
    }
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart data. Please refresh your cart.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while removing coupon'
    });
  }
};
