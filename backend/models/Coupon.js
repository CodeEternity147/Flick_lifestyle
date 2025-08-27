import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a coupon name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: [true, 'Please provide coupon value'],
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  maxUses: {
    type: Number,
    min: 0
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  userLimit: {
    type: Number,
    min: 1
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  isFirstTimeUser: {
    type: Boolean,
    default: false
  },
  isNewUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ 'usedBy.user': 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.maxUses || this.usedCount < this.maxUses)
  );
};

// Method to check if user can use coupon
couponSchema.methods.canUserUse = function(userId) {
  if (!this.isValid()) {
    return { valid: false, message: 'Coupon is not valid' };
  }
  
  if (this.userLimit) {
    const userUsageCount = this.usedBy.filter(usage => 
      usage.user.toString() === userId.toString()
    ).length;
    
    if (userUsageCount >= this.userLimit) {
      return { valid: false, message: 'Coupon usage limit reached for this user' };
    }
  }
  
  return { valid: true };
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.minOrderAmount) {
    return { valid: false, message: `Minimum order amount of ₹${this.minOrderAmount} required` };
  }
  
  let discountAmount = 0;
  
  if (this.type === 'percentage') {
    discountAmount = (orderAmount * this.value) / 100;
    if (this.maxDiscount) {
      discountAmount = Math.min(discountAmount, this.maxDiscount);
    }
  } else {
    discountAmount = this.value;
  }
  
  return {
    valid: true,
    discountAmount: Math.min(discountAmount, orderAmount)
  };
};

// Method to use coupon
couponSchema.methods.useCoupon = function(userId, orderId) {
  this.usedCount += 1;
  this.usedBy.push({
    user: userId,
    orderId: orderId
  });
  return this.save();
};

// Static method to find valid coupon by code
couponSchema.statics.findValidCoupon = async function(code, userId = null) {
  const coupon = await this.findOne({ code: code.toUpperCase() });
  
  if (!coupon) {
    return { valid: false, message: 'Coupon not found' };
  }
  
  if (!coupon.isValid()) {
    return { valid: false, message: 'Coupon is not valid' };
  }
  
  if (userId) {
    const userCheck = coupon.canUserUse(userId);
    if (!userCheck.valid) {
      return userCheck;
    }
  }
  
  return { valid: true, coupon };
};

// Pre-save middleware to validate dates
couponSchema.pre('save', function(next) {
  if (this.validFrom >= this.validUntil) {
    return next(new Error('Valid from date must be before valid until date'));
  }
  
  if (this.type === 'percentage' && this.value > 100) {
    return next(new Error('Percentage discount cannot exceed 100%'));
  }
  
  next();
});

export default mongoose.model('Coupon', couponSchema);
