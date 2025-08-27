import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    trim: true,
    maxlength: [100, 'Review title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true,
    maxlength: [500, 'Review comment cannot be more than 500 characters']
  },
  images: [{
    public_id: String,
    url: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide variant name']
  },
  value: {
    type: String,
    required: [true, 'Please provide variant value']
  },
  price: {
    type: Number,
    required: [true, 'Please provide variant price']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide variant stock'],
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  }
});

const bundleItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  category: {
    type: String,
    required: [true, 'Please provide bundle item category'],
    enum: [
      'Premium Perfumes',
      'Smartwatches',
      'Leather Wallets',
      'Handbags',
      'Wireless Earbuds',
      'Executive Pen & Notebook',
      'Grooming Kits',
      'Desk Organizers',
      'Sunglasses',
      'Portable Speakers',
      'Travel Essentials Kit',
      'Laptop Bags',
      'Skincare Hampers',
      'Coffee Hampers',
      'Watches',
      'Smart Desk Lamps'
    ]
  },
  name: {
    type: String,
    required: [true, 'Please provide bundle item name']
  },
  description: {
    type: String,
    required: [true, 'Please provide bundle item description']
  },
  image: {
    public_id: String,
    url: String
  },
  price: {
    type: Number,
    required: [true, 'Please provide bundle item price'],
    min: [0, 'Price cannot be negative']
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: function() {
      // Price is required only if the product doesn't have bundle items
      return !this.hasBundleItems;
    },
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  mainImage: {
    public_id: String,
    url: String,
    alt: String
  },
  variants: [variantSchema],
  specifications: [{
    name: String,
    value: String
  }],
  features: [String],
  tags: [String],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePercentage: {
    type: Number,
    min: [0, 'Sale percentage cannot be negative'],
    max: [100, 'Sale percentage cannot exceed 100']
  },
  saleStartDate: Date,
  saleEndDate: Date,
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: {
      type: String,
      enum: ['light', 'medium', 'heavy'],
      default: 'medium'
    }
  },
  // Bundle-specific fields (optional for any product)
  hasBundleItems: {
    type: Boolean,
    default: false
  },
  bundleItems: [bundleItemSchema],
  bundleSize: {
    type: Number,
    min: [1, 'Bundle size must be at least 1'],
    max: [16, 'Bundle size cannot exceed 16']
  },
  bundleDescription: {
    type: String,
    trim: true
  },
  bundleInstructions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ soldCount: -1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.isOnSale && this.salePercentage > 0) {
    return this.price - (this.price * this.salePercentage / 100);
  }
  return this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Pre-save middleware to update average rating
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Method to update stock
productSchema.methods.updateStock = function(quantity) {
  this.stock = Math.max(0, this.stock - quantity);
  return this.save();
};

export default mongoose.model('Product', productSchema);
