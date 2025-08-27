import Product from '../models/Product.js';

// @desc    Get bundle configuration for a product
// @route   GET /api/bundle/config/:productId
// @access  Public
export const getBundleConfig = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.hasBundleItems) {
      return res.status(400).json({
        success: false,
        message: 'This product does not have bundle items'
      });
    }

    res.json({
      success: true,
      data: {
        bundleConfig: {
          bundleSize: product.bundleSize,
          bundleDescription: product.bundleDescription,
          bundleInstructions: product.bundleInstructions,
          bundleItems: product.bundleItems
        }
      }
    });
  } catch (error) {
    console.error('Get bundle config error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bundle configuration'
    });
  }
};

// @desc    Update bundle selection for a user
// @route   PUT /api/bundle/selection/:productId
// @access  Private
export const updateBundleSelection = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedItems } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.hasBundleItems) {
      return res.status(400).json({
        success: false,
        message: 'This product does not have bundle items'
      });
    }

    if (selectedItems.length !== product.bundleSize) {
      return res.status(400).json({
        success: false,
        message: `You must select exactly ${product.bundleSize} items for this bundle`
      });
    }

    // Validate that all selected items exist in the bundle
    const validItemIds = product.bundleItems.map(item => item._id?.toString() || `${item.category}-${item.name}`);
    const allItemsValid = selectedItems.every(itemId => validItemIds.includes(itemId));

    if (!allItemsValid) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected items are not valid for this bundle'
      });
    }

    // Here you could save the selection to user preferences if needed
    // For now, we'll just return success

    res.json({
      success: true,
      message: 'Bundle selection updated successfully',
      data: {
        selectedItems,
        bundleSize: product.bundleSize
      }
    });
  } catch (error) {
    console.error('Update bundle selection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bundle selection'
    });
  }
};

// @desc    Get bundle categories
// @route   GET /api/bundle/categories
// @access  Public
export const getBundleCategories = async (req, res) => {
  try {
    const categories = [
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
    ];

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get bundle categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bundle categories'
    });
  }
};

// @desc    Get bundle items by category
// @route   GET /api/bundle/items/:category
// @access  Public
export const getBundleItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Find all products that have bundle items in the specified category
    const products = await Product.find({
      hasBundleItems: true,
      'bundleItems.category': category
    });

    const items = [];
    products.forEach(product => {
      const categoryItems = product.bundleItems.filter(item => item.category === category);
      items.push(...categoryItems);
    });

    res.json({
      success: true,
      data: {
        items
      }
    });
  } catch (error) {
    console.error('Get bundle items by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bundle items'
    });
  }
};

// @desc    Calculate bundle price
// @route   POST /api/bundle/calculate/:productId
// @access  Public
export const calculateBundlePrice = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedItems } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.hasBundleItems) {
      return res.status(400).json({
        success: false,
        message: 'This product does not have bundle items'
      });
    }

    // Calculate total price of selected items
    const selectedItemDetails = product.bundleItems.filter(item => 
      selectedItems.includes(item._id?.toString() || `${item.category}-${item.name}`)
    );

    const totalPrice = selectedItemDetails.reduce((sum, item) => sum + item.price, 0);

    res.json({
      success: true,
      data: {
        totalPrice,
        selectedItems: selectedItemDetails,
        itemCount: selectedItems.length
      }
    });
  } catch (error) {
    console.error('Calculate bundle price error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating bundle price'
    });
  }
};
