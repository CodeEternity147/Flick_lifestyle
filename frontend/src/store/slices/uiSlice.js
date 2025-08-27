import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  searchModalOpen: false,
  cartModalOpen: false,
  wishlistModalOpen: false,
  mobileMenuOpen: false,
  loading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
    },
    openSearchModal: (state) => {
      state.searchModalOpen = true;
    },
    toggleCartModal: (state) => {
      state.cartModalOpen = !state.cartModalOpen;
    },
    closeCartModal: (state) => {
      state.cartModalOpen = false;
    },
    openCartModal: (state) => {
      state.cartModalOpen = true;
    },
    toggleWishlistModal: (state) => {
      state.wishlistModalOpen = !state.wishlistModalOpen;
    },
    closeWishlistModal: (state) => {
      state.wishlistModalOpen = false;
    },
    openWishlistModal: (state) => {
      state.wishlistModalOpen = true;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    openMobileMenu: (state) => {
      state.mobileMenuOpen = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
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
    closeAllModals: (state) => {
      state.sidebarOpen = false;
      state.searchModalOpen = false;
      state.cartModalOpen = false;
      state.wishlistModalOpen = false;
      state.mobileMenuOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  openSidebar,
  toggleSearchModal,
  closeSearchModal,
  openSearchModal,
  toggleCartModal,
  closeCartModal,
  openCartModal,
  toggleWishlistModal,
  closeWishlistModal,
  openWishlistModal,
  toggleMobileMenu,
  closeMobileMenu,
  openMobileMenu,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
