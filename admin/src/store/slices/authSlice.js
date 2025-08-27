import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get admin from localStorage
const admin = JSON.parse(localStorage.getItem('admin'));
const token = localStorage.getItem('adminToken');

const initialState = {
  admin: admin || null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

// Async thunks
export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Check if user is admin
      if (response.data.data.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  }
);

export const getCurrentAdmin = createAsyncThunk(
  'auth/getCurrentAdmin',
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

      const response = await axios.get(`${API_URL}/auth/me`, config);
      
      // Verify admin role
      if (response.data.data.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get admin data'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('adminToken', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        localStorage.setItem('admin', JSON.stringify(action.payload.data.user));
        localStorage.setItem('adminToken', action.payload.data.token);
        toast.success('Login successful! Welcome back!');
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Login failed');
      })
      // Get Current Admin
      .addCase(getCurrentAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data.user;
        toast.success('Admin session restored');
      })
      .addCase(getCurrentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Session expired. Please login again.');
        // If token is invalid, logout
        if (action.payload === 'Not authorized to access this route') {
          state.admin = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
        }
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
