import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import { logout } from '../../store/slices/authSlice';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  LogOut,
  Package,
  Gift,
  Building2,
  Mail,
  Phone,
  ChevronDown,
  Home,
  Sparkles,
  Award,
  Users,
  Calendar
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Redux state
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      navigate('/login');
      return;
    }
    // Add to cart logic here
    console.log('Adding to cart');
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      navigate('/login');
      return;
    }
    // Add to wishlist logic here
    console.log('Adding to wishlist');
  };

  const cartItemCount = cartItems?.length || 0;
  const wishlistItemCount = wishlistItems?.length || 0;

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    {
      title: 'Home',
      path: '/',
      icon: Home,
      dropdown: null
    },
    {
      title: 'About',
      path: '/about',
      icon: Users,
      dropdown: null
    },
    {
      title: 'Shop It Now',
      path: '/shop',
      icon: ShoppingCart,
      dropdown: null
    },
    {
      title: 'Corporate Solutions',
      path: '/corporate/bulk',
      icon: Building2,
      dropdown: [
        { title: 'Bulk Orders', path: '/corporate/bulk', icon: Package },
        { title: 'Employee Products', path: '/corporate/employees', icon: Users },
        { title: 'Client Products', path: '/corporate/clients', icon: Award },
        { title: 'Event Products', path: '/corporate/events', icon: Calendar }
      ]
    },
    {
      title: 'Contact',
      path: '/contact',
      icon: Mail,
      dropdown: null
    }
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-[9999]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Top Bar with Offers and Contact Info */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2">
                <Phone size={14} />
                <span>+91 8445381703</span>
              </span>
              <span className="flex items-center space-x-2">
                <Mail size={14} />
                <span>info@flicklifestyle.com</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-blue-600 font-medium">🎉 Free Shipping on Orders Over $50!</span>
              <span className="text-green-400 font-medium">✨ 20% Off Corporate Orders</span>
            </div>
            <div className="md:hidden">
              <span className="text-yellow-400 font-medium text-xs">Free Shipping $50+</span>
            </div>
                </div>
              </div>
              </div>

      {/* Main Header */}
      <div className={`transition-all duration-500 animate-float-nav border-b border-white/20 ${
        scrolled 
          ? 'bg-gradient-to-b from-white/60 to-white/40 backdrop-blur-2xl shadow-xl animate-glow-pulse' 
          : 'bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="w-full px-6 sm:px-8 lg:px-10 py-2">
            {/* First Line - Logo and Brand Name Centered */}
            <div className="flex justify-center items-center h-16">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 1.65 }}
                className="flex  items-center cursor-pointer"
                onClick={() => handleNavigation('/')}
              >
                                 <div className="flex items-center space-x-4">
                   <div className="relative  ">
                     <img 
                       src={logo}
                       alt="Flick Lifestyle Logo"
                       className="  object-cover scale-95 "
                     />
                   </div>
                   <div className="text-center">
                   </div>
                 </div>
              </motion.div>
            </div>

            {/* Second Line - Navigation Tabs and User Actions Centered */}
            <div className="flex justify-center items-center h-12 px-4">
              {/* Navigation Tabs and Profile Icon Container */}
              <div className="flex items-center space-x-8">
                {/* Navigation Tabs */}
                <nav className="hidden lg:flex items-center space-x-8">
                  {navigationItems.map((item) => (
                    <div
                      key={item.title}
                      className="relative"
                      onMouseEnter={() => item.dropdown && setActiveDropdown(item.title)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <motion.div
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button 
                          onClick={() => handleNavigation(item.path)}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                            isActive(item.path)
                              ? 'text-rose-600 bg-rose-50/80 shadow-sm'
                              : 'text-gray-900 hover:text-rose-600 hover:bg-gray-50/80'
                          }`}
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                          {item.dropdown && (
                            <ChevronDown 
                              size={14} 
                              className={`transition-transform duration-200 ${
                                activeDropdown === item.title ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>
                      </motion.div>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {item.dropdown && activeDropdown === item.title && (
                          <motion.div
                            className="absolute top-full left-0 mt-2 w-56 bg-gradient-to-br from-purple-200 via-purple-300 to-pink-200 rounded-2xl shadow-2xl border border-purple-300/50 overflow-hidden backdrop-blur-sm"
                            initial={{ opacity: 0, y: 10, scale: 0.95, rotateX: -15 }}
                            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95, rotateX: -15 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.25)" }}
                          >
                            <div className="py-3">
                              {item.dropdown.map((dropItem, index) => (
                                <motion.button
                                  key={dropItem.path}
                                  onClick={() => handleNavigation(dropItem.path)}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-800 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 text-left border-l-4 border-transparent hover:border-purple-400"
                                  whileHover={{ x: 8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                  <motion.div
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <dropItem.icon size={16} className="text-purple-600" />
                                  </motion.div>
                                  <span className="font-semibold">{dropItem.title}</span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>

                {/* User Actions - Profile Icon Only */}
                <div className="hidden lg:flex items-center">
                  {/* Profile Icon - Only show when authenticated */}
                  {isAuthenticated && (
                    <div className="relative">
                      <motion.button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all duration-300"
                      >
                        <User size={20} />
                      </motion.button>

                      {/* User Dropdown Menu */}
                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-purple-200 via-purple-300 to-pink-200 rounded-2xl shadow-2xl border border-purple-300/50 overflow-hidden backdrop-blur-sm"
                            initial={{ opacity: 0, y: 10, scale: 0.95, rotateX: -15 }}
                            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95, rotateX: -15 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            <div className="py-4">
                              {/* User Info */}
                              <div className="flex items-center space-x-3 px-4 pb-3 border-b border-purple-300/30">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                  <User size={18} className="text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                                  <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
                                </div>
                              </div>

                              {/* Menu Items */}
                              <div className="py-2">
                                <motion.button
                                  onClick={() => { handleNavigation('/cart'); setUserMenuOpen(false); }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-800 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 text-left"
                                  whileHover={{ x: 8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <ShoppingCart size={16} className="text-purple-600" />
                                  <span className="font-medium">My Cart ({cartItemCount})</span>
                                </motion.button>

                                <motion.button
                                  onClick={() => { handleNavigation('/wishlist'); setUserMenuOpen(false); }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-800 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 text-left"
                                  whileHover={{ x: 8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Heart size={16} className="text-purple-600" />
                                  <span className="font-medium">My Wishlist ({wishlistItemCount})</span>
                                </motion.button>

                                <motion.button
                                  onClick={() => { handleNavigation('/profile'); setUserMenuOpen(false); }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-800 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 text-left"
                                  whileHover={{ x: 8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <User size={16} className="text-purple-600" />
                                  <span className="font-medium">My Profile</span>
                                </motion.button>

                                <motion.button
                                  onClick={() => { handleNavigation('/orders'); setUserMenuOpen(false); }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-800 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 text-left"
                                  whileHover={{ x: 8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Package size={16} className="text-purple-600" />
                                  <span className="font-medium">My Orders</span>
                                </motion.button>

                                <motion.button
                                  onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-400/20 hover:to-pink-400/20 transition-all duration-300 text-left"
                                  whileHover={{ x: 8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <LogOut size={16} />
                                  <span className="font-medium">Sign Out</span>
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button - Positioned on the right side of first line */}
            <div className="absolute top-4 right-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all duration-300"
                >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
                  </div>

        {/* Mobile Menu */}
                <AnimatePresence>
          {mobileMenuOpen && (
                                         <motion.div 
               className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-purple-200 via-purple-300 to-pink-200 shadow-2xl border border-purple-300/50 overflow-hidden backdrop-blur-sm"
               initial={{ opacity: 0, y: -20, scale: 0.95, rotateX: -15 }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
               exit={{ opacity: 0, y: -20, scale: 0.95, rotateX: -15 }}
               transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
             >
                             <div className="px-6 py-6 space-y-4">
               {navigationItems.map((item, itemIndex) => (
                 <motion.div 
                   key={item.title} 
                   className="space-y-2"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                 >
                   <motion.button
                     onClick={() => handleNavigation(item.path)}
                     className="flex items-center space-x-3 text-gray-800 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 py-3 px-4 rounded-xl w-full text-left border-l-4 border-transparent hover:border-purple-400"
                     whileHover={{ x: 8, scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     <motion.div
                       whileHover={{ rotate: 5, scale: 1.1 }}
                       transition={{ duration: 0.2 }}
                     >
                       <item.icon size={20} className="text-purple-600" />
                     </motion.div>
                     <span className="font-semibold">{item.title}</span>
                   </motion.button>
                   {item.dropdown && (
                     <div className="ml-8 space-y-1">
                       {item.dropdown.map((dropItem, dropIndex) => (
                         <motion.button
                           key={dropItem.path}
                           onClick={() => handleNavigation(dropItem.path)}
                           className="flex items-center space-x-3 text-sm text-gray-700 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 py-2 px-4 rounded-lg w-full text-left border-l-4 border-transparent hover:border-purple-400"
                           whileHover={{ x: 8, scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.3, delay: (itemIndex * 0.1) + (dropIndex * 0.05) }}
                         >
                           <motion.div
                             whileHover={{ rotate: 5, scale: 1.1 }}
                             transition={{ duration: 0.2 }}
                           >
                             <dropItem.icon size={16} className="text-purple-600" />
                           </motion.div>
                           <span className="font-medium">{dropItem.title}</span>
                         </motion.button>
                       ))}
                       </div>
                   )}
                 </motion.div>
               ))}
              
                             {/* Mobile User Actions - Only show when authenticated */}
               {isAuthenticated && (
                 <div className="pt-4 space-y-3">
                   <motion.div 
                     className="space-y-3"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: 0.5 }}
                   >
                     <div className="flex items-center space-x-3 pb-3 p-4 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-xl border border-purple-300/30">
                       <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                         <User size={18} className="text-white" />
                       </div>
                       <div>
                         <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                         <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
                       </div>
                     </div>
                     <motion.button
                       onClick={() => handleNavigation('/cart')}
                       className="flex items-center space-x-3 w-full text-left py-3 px-4 text-gray-700 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 rounded-xl border-l-4 border-transparent hover:border-purple-400"
                       whileHover={{ x: 8, scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <ShoppingCart size={18} className="text-purple-600" />
                       <span className="font-medium">My Cart ({cartItemCount})</span>
                     </motion.button>
                     <motion.button
                       onClick={() => handleNavigation('/wishlist')}
                       className="flex items-center space-x-3 w-full text-left py-3 px-4 text-gray-700 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 rounded-xl border-l-4 border-transparent hover:border-purple-400"
                       whileHover={{ x: 8, scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <Heart size={18} className="text-purple-600" />
                       <span className="font-medium">My Wishlist ({wishlistItemCount})</span>
                     </motion.button>
                     <motion.button
                       onClick={() => handleNavigation('/profile')}
                       className="flex items-center space-x-3 w-full text-left py-3 px-4 text-gray-700 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 rounded-xl border-l-4 border-transparent hover:border-purple-400"
                       whileHover={{ x: 8, scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <User size={18} className="text-purple-600" />
                       <span className="font-medium">My Profile</span>
                     </motion.button>
                     <motion.button
                       onClick={() => handleNavigation('/orders')}
                       className="flex items-center space-x-3 w-full text-left py-3 px-4 text-gray-700 hover:text-purple-800 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300 rounded-xl border-l-4 border-transparent hover:border-purple-400"
                       whileHover={{ x: 8, scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <Package size={18} className="text-purple-600" />
                       <span className="font-medium">My Orders</span>
                     </motion.button>
                     <motion.button
                       onClick={handleLogout}
                       className="flex items-center space-x-3 w-full text-left py-3 px-4 text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-400/20 hover:to-pink-400/20 transition-all duration-300 rounded-xl border-l-4 border-transparent hover:border-red-400"
                       whileHover={{ x: 8, scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <LogOut size={18} />
                       <span className="font-medium">Sign Out</span>
                     </motion.button>
                   </motion.div>
                 </div>
               )}
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;