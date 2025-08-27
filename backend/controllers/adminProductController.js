import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'name-asc':
          sort = { name: 1 };
          break;
        case 'name-desc':
          sort = { name: -1 };
          break;
        case 'stock-asc':
          sort = { stock: 1 };
          break;
        case 'stock-desc':
          sort = { stock: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    // Get products with pagination
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get single product (Admin)
// @route   GET /api/admin/products/:id
// @access  Private/Admin
export const getAdminProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get admin product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      isActive = true,
      isFeatured = false,
      tags,
      variants,
      specifications
    } = req.body;

    // Handle file uploads if present
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
              // Processing image files
      try {
        const { uploadImage } = await import('../utils/cloudinary.js');
        const uploadPromises = req.files.map((file, index) => {
          // Pass the buffer directly to Cloudinary
          return uploadImage(file.buffer, 'products');
        });
        const uploadResults = await Promise.all(uploadPromises);
        imageUrls = uploadResults.map(result => ({
          public_id: result.public_id,
          url: result.url
        }));
        // Successfully uploaded images
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: uploadError.message === 'File too large' 
            ? 'Image file is too large. Maximum size is 20MB per image.' 
            : 'Failed to upload images'
        });
      }
    }

    // Parse JSON strings if they come as strings from FormData
    let parsedTags = [];
    let parsedVariants = [];
    let parsedSpecifications = [];

    try {
      if (tags) {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      }
      if (variants) {
        const vars = typeof variants === 'string' ? JSON.parse(variants) : variants;
        // Convert frontend variant format to model format
        if (Array.isArray(vars)) {
          parsedVariants = vars.flatMap(variant => {
            if (variant.name && Array.isArray(variant.options)) {
              // Convert {name: "Color", options: ["Red", "Blue"]} to multiple variants
              return variant.options.map(option => ({
                name: variant.name,
                value: option,
                price: 0, // Default price, can be updated later
                stock: 0  // Default stock, can be updated later
              }));
            }
            return variant;
          });
        }
      }
      if (specifications) {
        const specs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
        // Convert object to array format if needed
        if (typeof specs === 'object' && !Array.isArray(specs)) {
          parsedSpecifications = Object.entries(specs).map(([name, value]) => ({ name, value: String(value) }));
        } else if (Array.isArray(specs)) {
          parsedSpecifications = specs;
        }
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({
        success: false,
        message: 'Invalid data format for tags, variants, or specifications'
      });
    }

    // Check if category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
      isActive: isActive === 'true' || isActive === true || isActive === '1',
      isFeatured: isFeatured === 'true' || isFeatured === true || isFeatured === '1',
      tags: parsedTags,
      variants: parsedVariants,
      specifications: parsedSpecifications
    });

    // Populate category
    await product.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      isActive,
      isFeatured,
      tags,
      variants,
      specifications
    } = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle file uploads if present
    let imageUrls = existingProduct.images || [];
    if (req.files && req.files.length > 0) {
      // Processing image files for update
      try {
        const { uploadImage } = await import('../utils/cloudinary.js');
        const uploadPromises = req.files.map((file, index) => {
          // Pass the buffer directly to Cloudinary
          return uploadImage(file.buffer, 'products');
        });
        const uploadResults = await Promise.all(uploadPromises);
        const newImageUrls = uploadResults.map(result => ({
          public_id: result.public_id,
          url: result.url
        }));
        imageUrls = [...imageUrls, ...newImageUrls];
        // Successfully uploaded new images
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images'
        });
      }
    }

    // Parse JSON strings if they come as strings from FormData
    let parsedTags = existingProduct.tags || [];
    let parsedVariants = existingProduct.variants || [];
    let parsedSpecifications = existingProduct.specifications || [];

    try {
      if (tags) {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      }
      if (variants) {
        const vars = typeof variants === 'string' ? JSON.parse(variants) : variants;
        // Convert frontend variant format to model format
        if (Array.isArray(vars)) {
          parsedVariants = vars.flatMap(variant => {
            if (variant.name && Array.isArray(variant.options)) {
              // Convert {name: "Color", options: ["Red", "Blue"]} to multiple variants
              return variant.options.map(option => ({
                name: variant.name,
                value: option,
                price: 0, // Default price, can be updated later
                stock: 0  // Default stock, can be updated later
              }));
            }
            return variant;
          });
        }
      }
      if (specifications) {
        const specs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
        // Convert object to array format if needed
        if (typeof specs === 'object' && !Array.isArray(specs)) {
          parsedSpecifications = Object.entries(specs).map(([name, value]) => ({ name, value: String(value) }));
        } else if (Array.isArray(specs)) {
          parsedSpecifications = specs;
        }
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({
        success: false,
        message: 'Invalid data format for tags, variants, or specifications'
      });
    }

    // Check if category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock && { stock: parseInt(stock) }),
        ...(category && { category }),
        images: imageUrls,
        ...(isActive !== undefined && { isActive: isActive === 'true' || isActive === true || isActive === '1' }),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' || isFeatured === true || isFeatured === '1' }),
        tags: parsedTags,
        variants: parsedVariants,
        specifications: parsedSpecifications
      },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is in any active orders
    // This is a basic check - you might want to implement more sophisticated logic
    // const orderWithProduct = await Order.findOne({
    //   'items.product': req.params.id,
    //   status: { $in: ['pending', 'processing', 'shipped'] }
    // });

    // if (orderWithProduct) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete product that is part of active orders'
    //   });
    // }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
};

// @desc    Toggle product status (Admin)
// @route   PATCH /api/admin/products/:id/toggle-status
// @access  Private/Admin
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling product status'
    });
  }
};

// @desc    Update product stock (Admin)
// @route   PATCH /api/admin/products/:id/stock
// @access  Private/Admin
export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product stock updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product stock'
    });
  }
};

// @desc    Bulk update products (Admin)
// @route   PATCH /api/admin/products/bulk-update
// @access  Private/Admin
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updates } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required'
      });
    }

    // Update products
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} products successfully`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while bulk updating products'
    });
  }
};
