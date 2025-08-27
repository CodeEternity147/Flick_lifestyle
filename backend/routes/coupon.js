import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Coupon from '../models/Coupon.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
router.post('/validate', protect, [
  body('code')
    .notEmpty()
    .withMessage('Coupon code is required'),
  body('orderAmount')
    .isFloat({ min: 0 })
    .withMessage('Order amount must be a positive number')
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

    const { code, orderAmount } = req.body;

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
    const discountResult = coupon.calculateDiscount(orderAmount);
    if (!discountResult.valid) {
      return res.status(400).json({
        success: false,
        message: discountResult.message
      });
    }

    res.json({
      success: true,
      message: 'Coupon is valid',
      data: {
        coupon: {
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value,
          maxDiscount: coupon.maxDiscount,
          discountAmount: discountResult.discountAmount
        }
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating coupon'
    });
  }
});

// @desc    Get active coupons
// @route   GET /api/coupons/active
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    })
    .select('code name description type value maxDiscount minOrderAmount validUntil')
    .sort({ validUntil: 1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        coupons
      }
    });
  } catch (error) {
    console.error('Get active coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active coupons'
    });
  }
});

// Admin routes
// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Admin
router.get('/', protect, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
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

    const { page = 1, limit = 20, isActive } = req.query;

    // Build filter
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const coupons = await Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Coupon.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        coupons,
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
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coupons'
    });
  }
});

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Admin
router.post('/', protect, authorize('admin'), [
  body('code')
    .notEmpty()
    .withMessage('Coupon code is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters'),
  body('name')
    .notEmpty()
    .withMessage('Coupon name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Coupon name must be between 2 and 100 characters'),
  body('type')
    .isIn(['percentage', 'fixed'])
    .withMessage('Type must be either percentage or fixed'),
  body('value')
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('validFrom')
    .isISO8601()
    .withMessage('Valid from date is required'),
  body('validUntil')
    .isISO8601()
    .withMessage('Valid until date is required'),
  body('minOrderAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount must be a positive number'),
  body('maxDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a positive number'),
  body('maxUses')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum uses must be a positive integer'),
  body('userLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User limit must be a positive integer')
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

    const {
      code,
      name,
      description,
      type,
      value,
      validFrom,
      validUntil,
      minOrderAmount = 0,
      maxDiscount,
      maxUses,
      userLimit,
      applicableCategories,
      applicableProducts,
      excludedProducts,
      isFirstTimeUser,
      isNewUser
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    // Validate percentage discount
    if (type === 'percentage' && value > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount cannot exceed 100%'
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      name,
      description,
      type,
      value,
      validFrom,
      validUntil,
      minOrderAmount,
      maxDiscount,
      maxUses,
      userLimit,
      applicableCategories,
      applicableProducts,
      excludedProducts,
      isFirstTimeUser,
      isNewUser
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: {
        coupon
      }
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating coupon'
    });
  }
});

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Admin
router.put('/:id', protect, authorize('admin'), [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Coupon name must be between 2 and 100 characters'),
  body('type')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Type must be either percentage or fixed'),
  body('value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('validFrom')
    .optional()
    .isISO8601()
    .withMessage('Valid from date must be a valid date'),
  body('validUntil')
    .optional()
    .isISO8601()
    .withMessage('Valid until date must be a valid date')
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

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Update coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: {
        coupon: updatedCoupon
      }
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating coupon'
    });
  }
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting coupon'
    });
  }
});

// @desc    Toggle coupon status (Admin)
// @route   PUT /api/coupons/:id/toggle
// @access  Admin
router.put('/:id/toggle', protect, authorize('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        coupon
      }
    });
  } catch (error) {
    console.error('Toggle coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling coupon status'
    });
  }
});

export default router;
