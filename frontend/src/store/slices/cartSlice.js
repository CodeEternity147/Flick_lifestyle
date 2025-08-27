import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
  summary: {
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  },
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        throw new Error('No token available');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/cart`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${API_URL}/cart`, cartData, config);
      return response.data;
    } catch (error) {
      // Handle validation errors specifically
      if (error.response?.status === 400 && error.response?.data?.message === 'Validation failed') {
        const validationErrors = error.response.data.errors;
        if (validationErrors && validationErrors.length > 0) {
          const errorMessages = validationErrors.map(err => `${err.param}: ${err.msg}`).join(', ');
          return rejectWithValue(`Validation failed: ${errorMessages}`);
        } else {
          return rejectWithValue('Validation failed: Invalid data provided');
        }
      }
      
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity, variant }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/cart/${productId}`,
        { quantity, variant },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, variant }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const url = variant
        ? `${API_URL}/cart/${productId}?variant=${JSON.stringify(variant)}`
        : `${API_URL}/cart/${productId}`;

      const response = await axios.delete(url, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${API_URL}/cart`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/cart/coupon`,
        { code: couponCode },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply coupon'
      );
    }
  }
);

export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        console.error('No token available for removeCoupon');
        return rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Attempting to remove coupon from:', `${API_URL}/cart/coupon`);
      const response = await axios.delete(`${API_URL}/cart/coupon`, config);
      console.log('Remove coupon response:', response.data);
      
      // Validate response structure
      if (!response.data || !response.data.success) {
        console.error('Invalid response structure:', response.data);
        return rejectWithValue('Invalid response from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Remove coupon error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please login again.');
      }
      
      if (error.response?.status === 400) {
        return rejectWithValue(error.response.data.message || 'Invalid request');
      }
      
      if (error.response?.status === 404) {
        return rejectWithValue('Coupon not found or already removed');
      }
      
      if (error.response?.status === 500) {
        return rejectWithValue('Server error. Please try again.');
      }
      
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove coupon'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCartState: (state) => {
      state.items = [];
      state.summary = {
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.cart.items || [];
        state.summary = action.payload.data.cart.summary || {
          itemCount: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.cart.items || [];
        state.summary = action.payload.data.cart.summary || {
          itemCount: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.cart.items || [];
        state.summary = action.payload.data.cart.summary || {
          itemCount: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.cart.items || [];
        state.summary = action.payload.data.cart.summary || {
          itemCount: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Remove from cart rejected:', action.payload);
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.summary = {
          itemCount: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply Coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.cart.items || [];
        state.summary = action.payload.data.cart.summary || {
          itemCount: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Coupon
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.loading = false;
        console.log('RemoveCoupon fulfilled with payload:', action.payload);
        
        if (action.payload && action.payload.data && action.payload.data.cart) {
          state.items = action.payload.data.cart.items || [];
          state.summary = action.payload.data.cart.summary || {
            itemCount: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
          };
          console.log('Cart state updated after coupon removal:', {
            items: state.items.length,
            summary: state.summary
          });
        } else {
          console.error('Invalid payload structure in removeCoupon.fulfilled:', action.payload);
        }
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
