import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'Please provide a category slug'],
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  image: {
    public_id: String,
    url: String,
    alt: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  path: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  productCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ sortOrder: 1 });

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for all descendants
categorySchema.virtual('descendants', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'path'
});

// Pre-save middleware to update level and path
categorySchema.pre('save', function(next) {
  if (this.parent) {
    this.level = 1;
    this.path = [this.parent];
  } else {
    this.level = 0;
    this.path = [];
  }
  next();
});

// Method to get all children recursively
categorySchema.methods.getAllChildren = async function() {
  const children = await this.model('Category').find({ parent: this._id });
  let allChildren = [...children];
  
  for (const child of children) {
    const grandChildren = await child.getAllChildren();
    allChildren = [...allChildren, ...grandChildren];
  }
  
  return allChildren;
};

// Method to get breadcrumb path
categorySchema.methods.getBreadcrumb = async function() {
  const breadcrumb = [this];
  let currentCategory = this;
  
  while (currentCategory.parent) {
    currentCategory = await this.model('Category').findById(currentCategory.parent);
    if (currentCategory) {
      breadcrumb.unshift(currentCategory);
    }
  }
  
  return breadcrumb;
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  const categoryMap = {};
  const roots = [];
  
  // Create a map of all categories
  categories.forEach(category => {
    categoryMap[category._id] = { ...category.toObject(), children: [] };
  });
  
  // Build the tree structure
  categories.forEach(category => {
    if (category.parent && categoryMap[category.parent]) {
      categoryMap[category.parent].children.push(categoryMap[category._id]);
    } else {
      roots.push(categoryMap[category._id]);
    }
  });
  
  return roots;
};

export default mongoose.model('Category', categorySchema);
