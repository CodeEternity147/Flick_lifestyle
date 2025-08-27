import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import { fetchFeaturedProducts, fetchCategories } from './store/slices/productSlice';
import toast from 'react-hot-toast';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ShippingInfo from './pages/ShippingInfo';
import NotFoundPage from './pages/NotFoundPage';

// Corporate Solution Pages
import BulkOrdersPage from './pages/BulkOrdersPage';
import EmployeeProductsPage from './pages/EmployeeProductsPage';
import ClientProductsPage from './pages/ClientProductsPage';
import EventProductsPage from './pages/EventProductsPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { error: authError } = useSelector((state) => state.auth);
  const { error: cartError } = useSelector((state) => state.cart);
  const { error: wishlistError } = useSelector((state) => state.wishlist);
  const { error: productError } = useSelector((state) => state.products);
  const { error: orderError } = useSelector((state) => state.orders);

  useEffect(() => {
    // Show error notifications
    if (authError) {
      toast.error(authError);
    }
    if (cartError) {
      toast.error(cartError);
    }
    if (wishlistError) {
      toast.error(wishlistError);
    }
    if (productError) {
      toast.error(productError);
    }
    if (orderError) {
      toast.error(orderError);
    }
  }, [authError, cartError, wishlistError, productError, orderError]);

  useEffect(() => {
    // Fetch initial data
    if (isAuthenticated && token) {
      dispatch(getCurrentUser());
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
    
    // Fetch public data
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch, isAuthenticated, token]);

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/shipping" element={<ShippingInfo />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Corporate Solution Routes */}
        <Route path="/corporate/bulk" element={<BulkOrdersPage />} />
        <Route path="/corporate/employees" element={<EmployeeProductsPage />} />
        <Route path="/corporate/clients" element={<ClientProductsPage />} />
        <Route path="/corporate/events" element={<EventProductsPage />} />
        
        {/* Protected Routes */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
