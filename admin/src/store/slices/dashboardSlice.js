import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        totalRevenue: 45231,
        totalOrders: 2350,
        totalCustomers: 1234,
        totalProducts: 89,
        revenueChange: '+20.1%',
        ordersChange: '+15.3%',
        customersChange: '+8.2%',
        productsChange: '+12.5%'
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch dashboard stats');
    }
  }
);

// Async thunk for fetching recent orders
export const fetchRecentOrders = createAsyncThunk(
  'dashboard/fetchRecentOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        { id: '001', customer: 'John Doe', product: 'Premium T-Shirt', amount: '89.99', status: 'completed' },
        { id: '002', customer: 'Jane Smith', product: 'Designer Jeans', amount: '129.99', status: 'pending' },
        { id: '003', customer: 'Mike Johnson', product: 'Sneakers', amount: '79.99', status: 'completed' },
        { id: '004', customer: 'Sarah Wilson', product: 'Hoodie', amount: '59.99', status: 'cancelled' },
        { id: '005', customer: 'Alex Brown', product: 'Cap', amount: '29.99', status: 'completed' }
      ];
    } catch (error) {
      return rejectWithValue('Failed to fetch recent orders');
    }
  }
);

// Async thunk for fetching top products
export const fetchTopProducts = createAsyncThunk(
  'dashboard/fetchTopProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return [
        { name: 'Premium T-Shirt', category: 'Clothing', revenue: '12,450', sales: 156 },
        { name: 'Designer Jeans', category: 'Clothing', revenue: '8,920', sales: 89 },
        { name: 'Sneakers', category: 'Footwear', revenue: '6,780', sales: 67 },
        { name: 'Hoodie', category: 'Clothing', revenue: '5,430', sales: 54 },
        { name: 'Cap', category: 'Accessories', revenue: '3,210', sales: 42 }
      ];
    } catch (error) {
      return rejectWithValue('Failed to fetch top products');
    }
  }
);

// Async thunk for fetching sales data
export const fetchSalesData = createAsyncThunk(
  'dashboard/fetchSalesData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return {
        daily: [1200, 1350, 1100, 1400, 1600, 1800, 1700],
        weekly: [8500, 9200, 8800, 9500, 10200, 9800, 10500],
        monthly: [45000, 48000, 52000, 49000, 55000, 58000, 62000]
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch sales data');
    }
  }
);

// Async thunk for fetching user analytics
export const fetchUserAnalytics = createAsyncThunk(
  'dashboard/fetchUserAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        newUsers: 45,
        activeUsers: 892,
        conversionRate: '3.2%',
        avgOrderValue: 1250,
        customerSatisfaction: 4.8
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch user analytics');
    }
  }
);

const initialState = {
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: '0%',
    ordersChange: '0%',
    customersChange: '0%',
    productsChange: '0%'
  },
  recentOrders: [],
  topProducts: [],
  salesData: {
    daily: [],
    weekly: [],
    monthly: []
  },
  userAnalytics: {
    newUsers: 0,
    activeUsers: 0,
    conversionRate: '0%',
    avgOrderValue: 0,
    customerSatisfaction: 0
  },
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchDashboardStats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchRecentOrders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchTopProducts
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchSalesData
      .addCase(fetchSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload;
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserAnalytics
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.userAnalytics = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDashboardError, resetDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
