import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
  coupons: [],
  currentCoupon: null,
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
    status: '',
    type: '',
    sort: 'newest',
    search: '',
  },
};

// Async thunks
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const params = new URLSearchParams();
      
      // Add pagination
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      // Add filters
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_URL}/coupons?${params}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch coupons'
      );
    }
  }
);

export const fetchCouponById = createAsyncThunk(
  'coupons/fetchCouponById',
  async (couponId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/coupons/${couponId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch coupon'
      );
    }
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${API_URL}/coupons`, couponData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create coupon'
      );
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async ({ couponId, couponData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`${API_URL}/coupons/${couponId}`, couponData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update coupon'
      );
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (couponId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${API_URL}/coupons/${couponId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete coupon'
      );
    }
  }
);

export const toggleCouponStatus = createAsyncThunk(
  'coupons/toggleCouponStatus',
  async (couponId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`${API_URL}/coupons/${couponId}/toggle`, {}, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle coupon status'
      );
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCoupon: (state) => {
      state.currentCoupon = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        type: '',
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
      // Fetch Coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.data.coupons || [];
        state.pagination = action.payload.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          total: 0,
          hasNextPage: false,
          hasPrevPage: false,
        };
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Coupon by ID
      .addCase(fetchCouponById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload.data.coupon;
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.unshift(action.payload.data.coupon);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(c => c._id === action.payload.data.coupon._id);
        if (index !== -1) {
          state.coupons[index] = action.payload.data.coupon;
        }
        if (state.currentCoupon && state.currentCoupon._id === action.payload.data.coupon._id) {
          state.currentCoupon = action.payload.data.coupon;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(c => c._id !== action.payload.data.couponId);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Coupon Status
      .addCase(toggleCouponStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(c => c._id === action.payload.data.coupon._id);
        if (index !== -1) {
          state.coupons[index] = action.payload.data.coupon;
        }
        if (state.currentCoupon && state.currentCoupon._id === action.payload.data.coupon._id) {
          state.currentCoupon = action.payload.data.coupon;
        }
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentCoupon,
  setFilters,
  clearFilters,
  setCurrentPage,
} = couponSlice.actions;
export default couponSlice.reducer;
