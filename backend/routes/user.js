import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../utils/cloudinary.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid phone number')
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

    const { name, phone } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @desc    Update user avatar
// @route   PUT /api/user/avatar
// @access  Private
router.put('/avatar', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadImage(imageUrl, 'avatars');

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: {
          public_id: uploadResult.public_id,
          url: uploadResult.url
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating avatar'
    });
  }
});

// @desc    Get user addresses
// @route   GET /api/user/addresses
// @access  Private
router.get('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    
    res.json({
      success: true,
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching addresses'
    });
  }
});

// @desc    Add user address
// @route   POST /api/user/addresses
// @access  Private
router.post('/addresses', protect, [
  body('type')
    .isIn(['home', 'work', 'other'])
    .withMessage('Type must be home, work, or other'),
  body('street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('city')
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .notEmpty()
    .withMessage('State is required'),
  body('zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('country')
    .optional()
    .isString()
    .withMessage('Country must be a string'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean')
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

    const { type, street, city, state, zipCode, country = 'India', isDefault = false } = req.body;

    const user = await User.findById(req.user._id);

    // If this is the first address or isDefault is true, set it as default
    if (user.addresses.length === 0 || isDefault) {
      // Remove default from all other addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add new address
    user.addresses.push({
      type,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: user.addresses.length === 0 || isDefault
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding address'
    });
  }
});

// @desc    Update user address
// @route   PUT /api/user/addresses/:id
// @access  Private
router.put('/addresses/:id', protect, [
  body('type')
    .optional()
    .isIn(['home', 'work', 'other'])
    .withMessage('Type must be home, work, or other'),
  body('street')
    .optional()
    .notEmpty()
    .withMessage('Street address cannot be empty'),
  body('city')
    .optional()
    .notEmpty()
    .withMessage('City cannot be empty'),
  body('state')
    .optional()
    .notEmpty()
    .withMessage('State cannot be empty'),
  body('zipCode')
    .optional()
    .notEmpty()
    .withMessage('ZIP code cannot be empty'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean')
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

    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === id);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, remove default from other addresses
    if (updateData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Update address
    Object.assign(user.addresses[addressIndex], updateData);
    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating address'
    });
  }
});

// @desc    Delete user address
// @route   DELETE /api/user/addresses/:id
// @access  Private
router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === id);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove address
    user.addresses.splice(addressIndex, 1);

    // If this was the default address and there are other addresses, set the first one as default
    if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting address'
    });
  }
});

// @desc    Set default address
// @route   PUT /api/user/addresses/:id/default
// @access  Private
router.put('/addresses/:id/default', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === id);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set this address as default
    user.addresses[addressIndex].isDefault = true;
    await user.save();

    res.json({
      success: true,
      message: 'Default address updated successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while setting default address'
    });
  }
});

export default router;
