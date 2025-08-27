import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance

// Method to add item to wishlist
wishlistSchema.methods.addItem = function(productId) {
  const existingItem = this.items.find(item => {
    // Handle both populated and unpopulated product references
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === productId.toString();
  });
  
  if (!existingItem) {
    this.items.push({ product: productId });
    this.lastUpdated = new Date();
    return this.save();
  }
  
  return this;
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = function(productId) {
  const itemIndex = this.items.findIndex(item => {
    // Handle both populated and unpopulated product references
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === productId.toString();
  });
  
  if (itemIndex > -1) {
    this.items.splice(itemIndex, 1);
    this.lastUpdated = new Date();
    return this.save();
  }
  
  // Return the wishlist without throwing an error if item not found
  return this;
};

// Method to clear wishlist
wishlistSchema.methods.clearWishlist = function() {
  this.items = [];
  this.lastUpdated = new Date();
  return this.save();
};

// Method to check if item exists in wishlist
wishlistSchema.methods.hasItem = function(productId) {
  return this.items.some(item => {
    // Handle both populated and unpopulated product references
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === productId.toString();
  });
};

// Static method to get wishlist by user
wishlistSchema.statics.getWishlistByUser = async function(userId) {
  let wishlist = await this.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price images stock isActive averageRating numReviews'
  });
  
  if (!wishlist) {
    wishlist = await this.create({ user: userId, items: [] });
  }
  
  return wishlist;
};

export default mongoose.model('Wishlist', wishlistSchema);
