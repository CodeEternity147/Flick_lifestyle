import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeAllModals } from '../../store/slices/uiSlice';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import SearchModal from '../modals/SearchModal';
import CartModal from '../modals/CartModal';
import WishlistModal from '../modals/WishlistModal';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Close all modals when route changes
  useEffect(() => {
    dispatch(closeAllModals());
  }, [location.pathname, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200 to-rose-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <Header />
      <MobileMenu />
      <SearchModal />
      <CartModal />
      <WishlistModal />
      
      <main className="flex-1 relative z-10 pt-44">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
