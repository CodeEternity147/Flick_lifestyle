import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'light',
  notifications: [],
  modals: {
    confirmDelete: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
    },
    productForm: {
      open: false,
      mode: 'create', // 'create' or 'edit'
      product: null,
    },
    couponForm: {
      open: false,
      mode: 'create', // 'create' or 'edit'
      coupon: null,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    // Modal actions
    openConfirmDelete: (state, action) => {
      state.modals.confirmDelete = {
        open: true,
        title: action.payload.title,
        message: action.payload.message,
        onConfirm: action.payload.onConfirm,
      };
    },
    closeConfirmDelete: (state) => {
      state.modals.confirmDelete = {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
      };
    },
    openProductForm: (state, action) => {
      state.modals.productForm = {
        open: true,
        mode: action.payload.mode || 'create',
        product: action.payload.product || null,
      };
    },
    closeProductForm: (state) => {
      state.modals.productForm = {
        open: false,
        mode: 'create',
        product: null,
      };
    },
    openCouponForm: (state, action) => {
      state.modals.couponForm = {
        open: true,
        mode: action.payload.mode || 'create',
        coupon: action.payload.coupon || null,
      };
    },
    closeCouponForm: (state) => {
      state.modals.couponForm = {
        open: false,
        mode: 'create',
        coupon: null,
      };
    },
    closeAllModals: (state) => {
      state.modals = {
        confirmDelete: {
          open: false,
          title: '',
          message: '',
          onConfirm: null,
        },
        productForm: {
          open: false,
          mode: 'create',
          product: null,
        },
        couponForm: {
          open: false,
          mode: 'create',
          coupon: null,
        },
      };
    },
  },
});

export const {
  toggleSidebar,
  toggleSidebarCollapsed,
  setSidebarOpen,
  setSidebarCollapsed,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openConfirmDelete,
  closeConfirmDelete,
  openProductForm,
  closeProductForm,
  openCouponForm,
  closeCouponForm,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
