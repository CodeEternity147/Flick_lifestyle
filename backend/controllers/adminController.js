import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Get total products
    const totalProducts = await Product.countDocuments();
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent orders count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get new users count (last 7 days)
    const newUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          recentOrders,
          newUsers
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};

// @desc    Get recent orders
// @route   GET /api/admin/dashboard/recent-orders
// @access  Private/Admin
export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent orders'
    });
  }
};

// @desc    Get top products
// @route   GET /api/admin/dashboard/top-products
// @access  Private/Admin
export const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .sort({ soldCount: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top products'
    });
  }
};

// @desc    Get sales data
// @route   GET /api/admin/dashboard/sales-data
// @access  Private/Admin
export const getSalesData = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    let groupBy = '$dayOfYear';
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = '$dayOfYear';
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        groupBy = '$dayOfYear';
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        groupBy = '$month';
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = '$month';
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
        groupBy = '$dayOfYear';
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        salesData,
        period
      }
    });
  } catch (error) {
    console.error('Get sales data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales data'
    });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/dashboard/user-analytics
// @access  Private/Admin
export const getUserAnalytics = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Get active users (users with orders)
    const activeUsers = await User.countDocuments({
      role: 'user',
      _id: { $in: await Order.distinct('user') }
    });
    
    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfMonth }
    });

    // Get user growth over time
    const userGrowth = await User.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        analytics: {
          totalUsers,
          activeUsers,
          newUsersThisMonth,
          userGrowth
        }
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user analytics'
    });
  }
};
