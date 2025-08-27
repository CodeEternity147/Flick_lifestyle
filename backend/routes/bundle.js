import express from 'express';
import {
  getBundleConfig,
  updateBundleSelection,
  getBundleCategories,
  getBundleItemsByCategory,
  calculateBundlePrice
} from '../controllers/bundleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get bundle configuration
router.get('/config/:productId', getBundleConfig);

// Update bundle selection (requires authentication)
router.put('/selection/:productId', protect, updateBundleSelection);

// Get available bundle categories
router.get('/categories', getBundleCategories);

// Get bundle items by category
router.get('/items/:category', getBundleItemsByCategory);

// Calculate bundle price
router.post('/calculate/:productId', calculateBundlePrice);

export default router;
