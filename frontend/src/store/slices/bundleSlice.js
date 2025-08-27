import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchBundleConfig = createAsyncThunk(
  'bundle/fetchBundleConfig',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bundle/config/${productId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bundle configuration');
    }
  }
);

export const updateBundleSelection = createAsyncThunk(
  'bundle/updateBundleSelection',
  async ({ productId, selectedItems }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        }
      };
      
      const response = await axios.put(
        `${API_BASE_URL}/bundle/selection/${productId}`,
        { selectedItems },
        config
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bundle selection');
    }
  }
);

export const fetchBundleCategories = createAsyncThunk(
  'bundle/fetchBundleCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bundle/categories`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bundle categories');
    }
  }
);

export const calculateBundlePrice = createAsyncThunk(
  'bundle/calculateBundlePrice',
  async ({ productId, selectedItems }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bundle/calculate/${productId}`,
        { selectedItems }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate bundle price');
    }
  }
);

const initialState = {
  bundleConfig: null,
  selectedItems: [],
  categories: [],
  priceCalculation: null,
  loading: false,
  error: null
};

const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {
    clearBundleState: (state) => {
      state.bundleConfig = null;
      state.selectedItems = [];
      state.priceCalculation = null;
      state.error = null;
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    addSelectedItem: (state, action) => {
      console.log('🎁 Redux: Adding item', action.payload, 'Current items:', state.selectedItems);
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
        console.log('🎁 Redux: Item added successfully. New items:', state.selectedItems);
      } else {
        console.log('🎁 Redux: Item already exists, not adding');
      }
    },
    removeSelectedItem: (state, action) => {
      console.log('🎁 Redux: Removing item', action.payload, 'Current items:', state.selectedItems);
      state.selectedItems = state.selectedItems.filter(id => id !== action.payload);
      console.log('🎁 Redux: Item removed successfully. New items:', state.selectedItems);
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch bundle config
      .addCase(fetchBundleConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBundleConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.bundleConfig = action.payload.bundleConfig;
        state.selectedItems = [];
      })
      .addCase(fetchBundleConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update bundle selection
      .addCase(updateBundleSelection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBundleSelection.fulfilled, (state, action) => {
        state.loading = false;
        state.bundleConfig = {
          ...state.bundleConfig,
          bundleItems: action.payload.bundleItems
        };
      })
      .addCase(updateBundleSelection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch bundle categories
      .addCase(fetchBundleCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBundleCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchBundleCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Calculate bundle price
      .addCase(calculateBundlePrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateBundlePrice.fulfilled, (state, action) => {
        state.loading = false;
        state.priceCalculation = action.payload;
      })
      .addCase(calculateBundlePrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearBundleState,
  setSelectedItems,
  addSelectedItem,
  removeSelectedItem,
  clearSelectedItems,
  setError,
  clearError
} = bundleSlice.actions;

export default bundleSlice.reducer;
