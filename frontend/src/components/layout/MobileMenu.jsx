import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  X,
  LogOut,
  Package,
  Sparkles
} from 'lucide-react';
import { closeMobileMenu, openSearchModal, openCartModal, openWishlistModal } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { clearCartState } from '../../store/slices/cartSlice';
import { clearWishlistState } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const MobileMenu = () => {
  const dispatch = useDispatch();
  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    dispatch(clearWishlistState());
    dispatch(closeMobileMenu());
    toast.success('Logged out successfully');
  };

  const cartItemCount = cartItems.length;
  const wishlistItemCount = wishlistItems.length;

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 z-50 md:hidden"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            onClick={() => dispatch(closeMobileMenu())}
          />
          
          {/* Menu */}
          <motion.div 
            className="fixed right-0 top-0 h-full w-80 glass shadow-2xl"
            variants={menuVariants}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between p-6 border-b border-white/20"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 font-heading">Menu</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(closeMobileMenu())}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
                >
                  <X size={24} />
                </motion.button>
              </motion.div>

              {/* Navigation */}
              <nav className="flex-1 p-6 overflow-y-auto">
                <motion.div 
                  className="space-y-2"
                  variants={itemVariants}
                >
                  {[
                    { to: "/", label: "Home" },
                    { to: "/shop", label: "Shop" },
                    { to: "/about", label: "About" },
                    { to: "/contact", label: "Contact" }
                  ].map((link, index) => (
                    <motion.div
                      key={link.to}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.to}
                        className="block py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 font-medium font-heading"
                        onClick={() => dispatch(closeMobileMenu())}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Actions */}
                <motion.div 
                  className="mt-8 space-y-2"
                  variants={itemVariants}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      dispatch(closeMobileMenu());
                      dispatch(openSearchModal());
                    }}
                    className="flex items-center w-full py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
                  >
                    <Search size={20} className="mr-3" />
                    Search
                  </motion.button>

                  {/* Wishlist - Only show if user is authenticated */}
                  {isAuthenticated && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        dispatch(closeMobileMenu());
                        dispatch(openWishlistModal());
                      }}
                      className="flex items-center w-full py-3 px-4 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
                    >
                      <Heart size={20} className="mr-3" />
                      Wishlist
                      {wishlistItemCount > 0 && (
                        <motion.span 
                          className="ml-auto bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          {wishlistItemCount}
                        </motion.span>
                      )}
                    </motion.button>
                  )}

                  {/* Cart - Only show if user is authenticated */}
                  {isAuthenticated && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        dispatch(closeMobileMenu());
                        dispatch(openCartModal());
                      }}
                      className="flex items-center w-full py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
                    >
                      <ShoppingCart size={20} className="mr-3" />
                      Cart
                      {cartItemCount > 0 && (
                        <motion.span 
                          className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          {cartItemCount}
                        </motion.span>
                      )}
                    </motion.button>
                  )}
                </motion.div>

                {/* User Section */}
                {isAuthenticated ? (
                  <motion.div 
                    className="mt-8 pt-8 border-t border-gray-200"
                    variants={itemVariants}
                  >
                    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <p className="text-sm text-gray-500">Welcome back,</p>
                      <p className="font-semibold text-gray-900 font-heading">{user?.name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { to: "/profile", icon: User, label: "Profile" },
                        { to: "/orders", icon: Package, label: "Orders" },
                        { to: "/wishlist", icon: Heart, label: "Wishlist" }
                      ].map((item, index) => (
                        <motion.div
                          key={item.to}
                          variants={itemVariants}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            to={item.to}
                            className="flex items-center py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
                            onClick={() => dispatch(closeMobileMenu())}
                          >
                            <item.icon size={20} className="mr-3" />
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center w-full py-3 px-4 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
                      >
                        <LogOut size={20} className="mr-3" />
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="mt-8 pt-8 border-t border-gray-200 space-y-3"
                    variants={itemVariants}
                  >
                    <Link
                      to="/login"
                      className="block w-full text-center py-3 px-4 border-2 border-indigo-500 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-300 font-heading"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 font-heading"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                )}
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
