import express from 'express';
import { body, validationResult, query } from 'express-validator';
import multer from 'multer';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import { 
  getDashboardStats, 
  getRecentOrders, 
  getTopProducts, 
  getSalesData, 
  getUserAnalytics 
} from '../controllers/adminController.js';
import {
  getAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateProductStock,
  bulkUpdateProducts
} from '../controllers/adminProductController.js';
import {
  getAdminCategories,
  getAdminCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} from '../controllers/adminCategoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit (increased from 5MB)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// All routes require admin access
router.use(protect, authorize('admin'));

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Admin
router.get('/dashboard/stats', getDashboardStats);

// @desc    Get recent orders for dashboard
// @route   GET /api/admin/dashboard/recent-orders
// @access  Admin
router.get('/dashboard/recent-orders', getRecentOrders);

// @desc    Get top products for dashboard
// @route   GET /api/admin/dashboard/top-products
// @access  Admin
router.get('/dashboard/top-products', getTopProducts);

// @desc    Get sales data for dashboard
// @route   GET /api/admin/dashboard/sales-data
// @access  Admin
router.get('/dashboard/sales-data', [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Period must be 7d, 30d, 90d, or 1y')
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
  
  return getSalesData(req, res);
});

// @desc    Get user analytics for dashboard
// @route   GET /api/admin/dashboard/user-analytics
// @access  Admin
router.get('/dashboard/user-analytics', getUserAnalytics);

// ==================== PRODUCT MANAGEMENT ROUTES ====================

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Admin
router.get('/products', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('category').optional().isMongoId().withMessage('Category must be a valid ID'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('sort').optional().isIn(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'stock-asc', 'stock-desc']).withMessage('Invalid sort option')
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
  
  return getAdminProducts(req, res);
});

// @desc    Get single product (Admin)
// @route   GET /api/admin/products/:id
// @access  Admin
router.get('/products/:id', getAdminProduct);

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
// @access  Admin
router.post('/products', upload.array('images', 10), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .isMongoId()
    .withMessage('Category must be a valid ID'),
  body('isActive')
    .optional()
    .isIn(['true', 'false', '1', '0', true, false])
    .withMessage('isActive must be a boolean value'),
  body('isFeatured')
    .optional()
    .isIn(['true', 'false', '1', '0', true, false])
    .withMessage('isFeatured must be a boolean value'),
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a JSON string'),
  body('variants')
    .optional()
    .isString()
    .withMessage('Variants must be a JSON string'),
  body('specifications')
    .optional()
    .isString()
    .withMessage('Specifications must be a JSON string')
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
  
  return createProduct(req, res);
});

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Admin
router.put('/products/:id', upload.array('images', 10), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid ID'),
  body('isActive')
    .optional()
    .isIn(['true', 'false', '1', '0', true, false])
    .withMessage('isActive must be a boolean value'),
  body('isFeatured')
    .optional()
    .isIn(['true', 'false', '1', '0', true, false])
    .withMessage('isFeatured must be a boolean value'),
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a JSON string'),
  body('variants')
    .optional()
    .isString()
    .withMessage('Variants must be a JSON string'),
  body('specifications')
    .optional()
    .isString()
    .withMessage('Specifications must be a JSON string')
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
  
  return updateProduct(req, res);
});

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Admin
router.delete('/products/:id', deleteProduct);

// @desc    Toggle product status (Admin)
// @route   PATCH /api/admin/products/:id/toggle-status
// @access  Admin
router.patch('/products/:id/toggle-status', toggleProductStatus);

// @desc    Update product stock (Admin)
// @route   PATCH /api/admin/products/:id/stock
// @access  Admin
router.patch('/products/:id/stock', [
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
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
  
  return updateProductStock(req, res);
});

// @desc    Bulk update products (Admin)
// @route   PATCH /api/admin/products/bulk-update
// @access  Admin
router.patch('/products/bulk-update', [
  body('productIds')
    .isArray({ min: 1 })
    .withMessage('Product IDs must be a non-empty array'),
  body('updates')
    .isObject()
    .withMessage('Updates must be an object')
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
  
  return bulkUpdateProducts(req, res);
});

// ==================== CATEGORY MANAGEMENT ROUTES ====================

// @desc    Get all categories (Admin)
// @route   GET /api/admin/categories
// @access  Admin
router.get('/categories', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('sort').optional().isIn(['name-asc', 'name-desc']).withMessage('Invalid sort option')
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
  
  return getAdminCategories(req, res);
});

// @desc    Get single category (Admin)
// @route   GET /api/admin/categories/:id
// @access  Admin
router.get('/categories/:id', getAdminCategory);

// @desc    Create new category (Admin)
// @route   POST /api/admin/categories
// @access  Admin
router.post('/categories', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
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
  
  return createCategory(req, res);
});

// @desc    Update category (Admin)
// @route   PUT /api/admin/categories/:id
// @access  Admin
router.put('/categories/:id', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
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
  
  return updateCategory(req, res);
});

// @desc    Delete category (Admin)
// @route   DELETE /api/admin/categories/:id
// @access  Admin
router.delete('/categories/:id', deleteCategory);

// @desc    Toggle category status (Admin)
// @route   PATCH /api/admin/categories/:id/toggle-status
// @access  Admin
router.patch('/categories/:id/toggle-status', toggleCategoryStatus);

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20, search, role, isActive } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @desc    Update user status (Admin)
// @route   PUT /api/admin/users/:id/status
// @access  Admin
router.put('/users/:id/status', [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Admin
router.get('/analytics/sales', [
  query('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Period must be daily, weekly, monthly, or yearly'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { period = 'monthly', startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.createdAt = { $gte: thirtyDaysAgo };
    }

    // Add payment status filter
    dateFilter.paymentStatus = 'completed';

    // Build aggregation pipeline
    let groupBy = {};
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      case 'yearly':
        groupBy = {
          year: { $year: '$createdAt' }
        };
        break;
    }

    const salesData = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        salesData,
        topProducts,
        period,
        dateRange: {
          startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: endDate || new Date()
        }
      }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales analytics'
    });
  }
});

// @desc    Get inventory analytics
// @route   GET /api/admin/analytics/inventory
// @access  Admin
router.get('/analytics/inventory', async (req, res) => {
  try {
    // Get inventory stats
    const totalProducts = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lt: 10 } });
    const inStock = await Product.countDocuments({ stock: { $gte: 10 } });

    // Get low stock products
    const lowStockProducts = await Product.find({ stock: { $gt: 0, $lt: 10 } })
      .select('name stock price category')
      .populate('category', 'name')
      .sort({ stock: 1 })
      .limit(10);

    // Get out of stock products
    const outOfStockProducts = await Product.find({ stock: 0 })
      .select('name price category')
      .populate('category', 'name')
      .limit(10);

    // Get category-wise inventory
    const categoryInventory = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          averageStock: { $avg: '$stock' }
        }
      },
      { $sort: { totalStock: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          outOfStock,
          lowStock,
          inStock
        },
        lowStockProducts,
        outOfStockProducts,
        categoryInventory
      }
    });
  } catch (error) {
    console.error('Get inventory analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inventory analytics'
    });
  }
});

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Admin
router.get('/analytics/users', async (req, res) => {
  try {
    // Get user stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const inactiveUsers = await User.countDocuments({ role: 'user', isActive: false });

    // Get user registration trend (last 6 months)
    const registrationTrend = await User.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          newUsers: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get top customers by order value
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalOrders: 1,
          totalSpent: 1,
          averageOrderValue: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          inactiveUsers
        },
        registrationTrend,
        topCustomers
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user analytics'
    });
  }
});

export default router;
