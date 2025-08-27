import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  variant: {
    name: String,
    value: String,
    price: Number
  },
  price: {
    type: Number,
    required: true
  },
  // Bundle-specific fields
  selectedBundleItems: [{
    type: String // Changed from ObjectId to String to handle both ObjectIds and custom identifiers
  }],
  bundleItems: [{
    category: String,
    name: String,
    description: String,
    image: {
      public_id: String,
      url: String
    },
    price: Number
  }],
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  coupon: {
    code: String,
    discountAmount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance

// Virtual for cart summary
cartSchema.virtual('summary').get(function() {
  const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = (this.coupon && this.coupon.discountAmount) ? this.coupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount);
  
  return {
    itemCount,
    subtotal,
    discount,
    total
  };
});

// Method to get cart summary (non-virtual for debugging)
cartSchema.methods.getSummary = function() {
  const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = (this.coupon && this.coupon.discountAmount) ? this.coupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount);
  
  return {
    itemCount,
    subtotal,
    discount,
    total
  };
};

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, variant = null, price = null, selectedBundleItems = null) {
  const existingItemIndex = this.items.findIndex(item => {
    // Handle both populated and unpopulated product references
    if (!item.product) return false;
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === productId.toString() &&
           JSON.stringify(item.variant) === JSON.stringify(variant) &&
           JSON.stringify(item.selectedBundleItems) === JSON.stringify(selectedBundleItems);
  });
  
  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
  } else {
    const newItem = {
      product: productId,
      quantity,
      variant,
      price
    };
    
    // Add bundle information if provided
    if (selectedBundleItems) {
      newItem.selectedBundleItems = selectedBundleItems;
    }
    
    this.items.push(newItem);
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, variant = null) {
  const itemIndex = this.items.findIndex(item => {
    // Handle both populated and unpopulated product references
    if (!item.product) return false;
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === productId.toString() &&
           JSON.stringify(item.variant) === JSON.stringify(variant);
  });
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
    this.lastUpdated = new Date();
    return this.save();
  }
  
  // Return the cart without throwing an error if item not found
  return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId, variant = null) {
  const itemIndex = this.items.findIndex(item => {
    // Handle both populated and unpopulated product references
    if (!item.product) return false;
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === productId.toString() &&
           JSON.stringify(item.variant) === JSON.stringify(variant);
  });
  
  if (itemIndex > -1) {
    this.items.splice(itemIndex, 1);
    this.lastUpdated = new Date();
    return this.save();
  }
  
  // Return the cart without throwing an error if item not found
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = null;
  this.lastUpdated = new Date();
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discountAmount, discountType = 'percentage') {
  this.coupon = {
    code: couponCode,
    discountAmount,
    discountType
  };
  this.lastUpdated = new Date();
  // Force mark coupon field as modified to ensure it's saved
  this.markModified('coupon');
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.coupon = null;
  this.lastUpdated = new Date();
  // Force mark coupon field as modified to ensure it's saved
  this.markModified('coupon');
  
  return this.save().then(savedCart => {
    return savedCart;
  }).catch(error => {
    console.error('Error saving cart after coupon removal:', error);
    throw error;
  });
};

// Alternative method to remove coupon using update
cartSchema.methods.removeCouponAlt = function() {
  return this.model('Cart').updateOne(
    { _id: this._id },
    { 
      $set: { 
        coupon: null,
        lastUpdated: new Date() 
      }
    }
  ).then(result => {
    return result;
  }).catch(error => {
    console.error('Error in removeCouponAlt:', error);
    throw error;
  });
};

// Method to clean up invalid cart items
cartSchema.methods.cleanupInvalidItems = async function() {
  const validItems = [];
  const originalLength = this.items.length;
  
  for (const item of this.items) {
    try {
      // Check if the product exists and is active
      const product = await mongoose.model('Product').findById(item.product);
      if (product && product.isActive) {
        validItems.push(item);
      } else {
        // Removing invalid product from cart
      }
    } catch (error) {
      // Error checking product
    }
  }
  
  if (validItems.length !== originalLength) {
    this.items = validItems;
    this.lastUpdated = new Date();
    await this.save();
  }
  
  return this;
};

// Static method to get cart by user
cartSchema.statics.getCartByUser = async function(userId) {
  let cart = await this.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price images stock isActive'
  });
  
  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  } else {
    // Clean up cart items with invalid/deleted products
    const validItems = cart.items.filter(item => item.product !== null);
    
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.lastUpdated = new Date();
      await cart.save();
    }
    
    // Also run the full cleanup to check for inactive products
    await cart.cleanupInvalidItems();
  }
  
  return cart;
};

export default mongoose.model('Cart', cartSchema);
