import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Simple in-memory cache for products
const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

const initialState = {
  products: [],
  featuredProducts: [],
  saleProducts: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'newest',
    search: '',
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      // Add pagination
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      // Add filters
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_URL}/products?${params}`);
      return response.data;
    } catch (error) {
      // Silently handle network errors without logging to console
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Network error');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      // Check cache first
      const cachedData = productCache.get(productId);
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        console.log('📦 Using cached product data for:', productId);
        return cachedData.data;
      }

      console.log('📦 Fetching fresh product data for:', productId);
      const response = await axios.get(`${API_URL}/products/${productId}`);
      
      // Cache the response
      productCache.set(productId, {
        data: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      // Silently handle network errors without logging to console
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Network error');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/featured`);
      return response.data;
    } catch (error) {
      // Silently handle network errors without logging to console
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Network error');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch featured products'
      );
    }
  }
);

export const fetchSaleProducts = createAsyncThunk(
  'products/fetchSaleProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/sale`);
      return response.data;
    } catch (error) {
      // Silently handle network errors without logging to console
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Network error');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch sale products'
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/products/search?q=${encodeURIComponent(searchQuery)}`
      );
      return response.data;
    } catch (error) {
      // Silently handle network errors without logging to console
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Network error');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search products'
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      // Silently handle network errors without logging to console
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Network error');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

export const fetchCategoryTree = createAsyncThunk(
  'products/fetchCategoryTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories/tree`);
      return response.data;
    } catch (error) {
      // Silently handle network errors without logging to console
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Network error');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category tree'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProductCache: () => {
      // Clear the in-memory cache
      productCache.clear();
      console.log('📦 Product cache cleared');
    },
    clearProductFromCache: (state, action) => {
      // Clear a specific product from cache
      const productId = action.payload;
      productCache.delete(productId);
      console.log('📦 Product removed from cache:', productId);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        rating: '',
        sort: 'newest',
        search: '',
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products || [];
        state.pagination = action.payload.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          total: 0,
          hasNextPage: false,
          hasPrevPage: false,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        // Don't set error for products to avoid toast spam
        state.products = [];
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.data.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        // Don't set error for product details to avoid toast spam
        state.currentProduct = null;
      })
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload.data.products || [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        // Don't set error for featured products to avoid toast spam
        state.featuredProducts = [];
      })
      // Fetch Sale Products
      .addCase(fetchSaleProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.saleProducts = action.payload.data.products || [];
      })
      .addCase(fetchSaleProducts.rejected, (state, action) => {
        state.loading = false;
        // Don't set error for sale products to avoid toast spam
        state.saleProducts = [];
      })
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data.categories || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        // Don't set error for categories to avoid toast spam
        state.categories = [];
      })
      // Fetch Category Tree
      .addCase(fetchCategoryTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data.categories || [];
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentProduct,
  clearProductCache,
  clearProductFromCache,
  setFilters,
  clearFilters,
  setCurrentPage,
} = productSlice.actions;
export default productSlice.reducer;
