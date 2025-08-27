// pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';
import giftAnimation from '../components/animation/Gift Box.json';
import { 
  ArrowRight, Star, ShoppingCart, Heart, Gift, Award, 
  Truck, Shield, Zap, Users, TrendingUp, Sparkles,
  Package, Clock, CheckCircle, Globe, Play, ArrowUpRight,
  Sparkles as SparklesIcon, Zap as ZapIcon, Star as StarIcon
} from 'lucide-react';
import { fetchFeaturedProducts, fetchSaleProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import CouponBanner from '../components/common/CouponBanner';
import toast from 'react-hot-toast';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts, saleProducts, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchSaleProducts());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchSaleProducts());
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!product._id) {
      toast.error('Invalid product data');
      return;
    }
    
    try {
      const result = await dispatch(addToCart({
        productId: product._id,
        quantity: 1
      }));
      
      if (addToCart.fulfilled.match(result)) {
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlistToggle = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!product._id) {
      toast.error('Invalid product data');
      return;
    }
    
    const isInWishlist = wishlistItems.some(item => item.product._id === product._id);
    
    try {
      if (isInWishlist) {
        const result = await dispatch(removeFromWishlist(product._id));
        if (removeFromWishlist.fulfilled.match(result)) {
          toast.success('Removed from wishlist');
        }
      } else {
        const result = await dispatch(addToWishlist(product._id));
        if (addToWishlist.fulfilled.match(result)) {
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product._id === productId);
  };

  const ProductCard = ({ product, showDiscount = false, colorTheme = 'blue' }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    const colorThemes = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        border: 'border-blue-200/50',
        accent: 'text-blue-600',
        button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
        glow: 'shadow-blue-500/20'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        border: 'border-purple-200/50',
        accent: 'text-purple-600',
        button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
        glow: 'shadow-purple-500/20'
      },
      green: {
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        border: 'border-emerald-200/50',
        accent: 'text-emerald-600',
        button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
        glow: 'shadow-emerald-500/20'
      },
      pink: {
        bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
        border: 'border-pink-200/50',
        accent: 'text-pink-600',
        button: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700',
        glow: 'shadow-pink-500/20'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
        border: 'border-orange-200/50',
        accent: 'text-orange-600',
        button: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700',
        glow: 'shadow-orange-500/20'
      }
    };

    const theme = colorThemes[colorTheme] || colorThemes.blue;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group"
      >
        <div className={`${theme.bg} ${theme.border} border rounded-3xl overflow-hidden hover:shadow-2xl ${theme.glow} transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm product-card-hover`}>
          <div className="relative overflow-hidden">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.mainImage?.url || product.images[0]?.url}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </Link>
            
                         {showDiscount && product.discountPercentage > 0 && (
               <motion.div 
                 className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
               >
                 -{product.discountPercentage}% OFF
               </motion.div>
             )}
            
                         <motion.button
               onClick={() => handleWishlistToggle(product)}
               className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                 isInWishlist(product._id)
                   ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                   : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
               }`}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
             >
              <Heart size={18} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
          
          <div className="p-6">
                         <Link to={`/product/${product._id}`}>
               <h3 className="font-bold text-md text-gray-800 mb-3 line-clamp-2 hover:text-purple-600 transition-colors">
                 {product.name}
               </h3>
             </Link>
            
            <p className="text-gray-600 text-[12px] mb-4 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
            
            
           
            
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => handleAddToCart(product)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </motion.button>
              <Link
                to={`/product/${product._id}`}
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                View Details
                <ArrowUpRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

     const categories = [
     { name: 'Home & Living', icon: '🏠', color: 'bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200 text-pink-700', hover: 'hover:from-pink-200 hover:to-rose-200' },
     { name: 'Fashion & Style', icon: '👗', color: 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200 text-blue-700', hover: 'hover:from-blue-200 hover:to-indigo-200' },
     { name: 'Beauty & Wellness', icon: '💄', color: 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 text-purple-700', hover: 'hover:from-purple-200 hover:to-pink-200' },
     { name: 'Tech & Gadgets', icon: '📱', color: 'bg-gradient-to-br from-red-100 to-pink-100 border-red-200 text-red-700', hover: 'hover:from-red-200 hover:to-pink-200' },
     { name: 'Personalized', icon: '✨', color: 'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-200 text-yellow-700', hover: 'hover:from-yellow-200 hover:to-amber-200' },
     { name: 'Luxury Collections', icon: '💎', color: 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200 text-emerald-700', hover: 'hover:from-emerald-200 hover:to-teal-200' },
   ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹999',
      color: 'text-blue-600 bg-gradient-to-br from-blue-100 to-indigo-100'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
      color: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-teal-100'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Handpicked products',
      color: 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100'
    },
    {
      icon: Clock,
      title: 'Quick Delivery',
      description: 'Same day delivery',
      color: 'text-orange-600 bg-gradient-to-br from-orange-100 to-amber-100'
    },
    {
      icon: Gift,
      title: 'Customize Gifting',
      description: 'Personalized gift items',
      color: 'text-pink-600 bg-gradient-to-br from-pink-100 to-rose-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
             {/* Hero Section */}
       <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-[#e4d9ff] overflow-hidden">
         {/* Animated Background Elements */}
         <div className="absolute inset-0">
           <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-white/40 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
           <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-400/50 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-pink-400/40 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
         </div>
         
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid  grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="text-center lg:text-left order-2 lg:order-1"
             >
               <motion.div 
                 className="bg-gradient-to-r  from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block mb-6 sm:mb-8 shadow-lg shadow-purple-500/30"
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
               >
                 <div className="flex items-center space-x-2 sm:space-x-3">
                   <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
                   <span className="font-bold text-sm sm:text-base">Premium Office Gift Collection</span>
                 </div>
               </motion.div>
               
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 font-black text-gray-900 mb-6 sm:mb-8 leading-tight">
               Luxury Gift Kits 
                 <span className="block bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent">
                 That Celebrate Your Workplace
                 </span>
               </h1>
               
               <p className="text-base text-justify sm:text-lg md:text-xl text-gray-800 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
               Discover Luxury office gift kits with personalized and curated collections, designed to appreciate teams, delight clients, and celebrate every occasion
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-10 justify-center lg:justify-start">
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="w-full sm:w-auto"
                 >
                   <Link
                     to="/shop"
                     className="btn-gradient text-white px-8 sm:px-12 py-3 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 inline-flex items-center justify-center shadow-purple-glow hover:scale-105 transform w-full sm:w-auto"
                   >
                     <Gift className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                     Shop Now
                     <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                   </Link>
                 </motion.div>
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="w-full sm:w-auto"
                 >
                   <Link
                     to="/product-finder"
                     className="bg-white/80 backdrop-blur-lg border border-white/50 text-gray-800 px-8 sm:px-10 py-3 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 inline-flex items-center justify-center hover:bg-white hover:shadow-lg w-full sm:w-auto"
                   >
                     <Sparkles className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                     Explore Products
                   </Link>
                 </motion.div>
               </div>
             </motion.div>
             
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative order-1 lg:order-2"
             >
               <div className="relative flex justify-center lg:justify-end">
                 <motion.div
                   className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-112 lg:h-112 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-4 sm:p-6"
                   whileHover={{ scale: 1.02 }}
                   transition={{ duration: 0.3 }}
                 >
                   <Lottie
                     animationData={giftAnimation}
                     loop={true}
                     autoplay={true}
                     className="w-full h-full"
                     style={{ maxWidth: '100%', height: 'auto' }}
                   />
                   
                   {/* Floating elements around the animation */}
                   <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                     <motion.div
                       animate={{ rotate: 360 }}
                       transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                       className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"
                     />
                   </div>
                   <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
                     <motion.div
                       animate={{ y: [-5, 5, -5] }}
                       transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                       className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-60"
                     />
                   </div>
                   <div className="absolute top-1/2 left-2 sm:left-4">
                     <motion.div
                       animate={{ scale: [1, 1.2, 1] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-60"
                     />
                   </div>
                 </motion.div>
                 
                 {/* Decorative elements */}
                 <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-lg sm:blur-xl"></div>
                 <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-lg sm:blur-xl"></div>
               </div>
             </motion.div>
           </div>
         </div>
       </section>
 {/* Enhanced Features Section */}
 <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
   {/* Enhanced background elements */}
   <div className="absolute inset-0">
     {/* Soft gradient orbs */}
     <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
     <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-200/40 to-indigo-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
     <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="w-full h-full" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
    </div>
  </div>
  
  {/* Main content */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-24"
    >
      {/* Simple badge */}
      <div className="inline-flex items-center px-6 py-3 mb-8 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full shadow-sm">
        <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse"></span>
        <span className="text-gray-700 font-semibold tracking-wide text-sm">PREMIUM EXPERIENCE</span>
      </div>
      
      <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
        Why Choose 
        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Flick Lifestyle?
        </span>
      </h2>
      
      <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-16 leading-relaxed">
        Experience premium lifestyle products with our exceptional services and quality items that make every moment 
        <span className="text-purple-600 font-semibold">absolutely special</span>
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            y: -8,
            transition: { duration: 0.3 }
          }}
          className="group"
        >
                     <div className="relative h-72 rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-500 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2">
             {/* Enhanced hover background */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             {/* Subtle gradient overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-gray-50/80"></div>
            
            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center">
                             {/* Enhanced icon container */}
               <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 shadow-xl group-hover:shadow-2xl relative overflow-hidden`}>
                 {/* Icon background glow */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <feature.icon size={32} className="transform transition-transform duration-300 group-hover:rotate-12" />
               </div>
              
                             <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                 {feature.title}
               </h3>
               
               <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300 flex-grow">
                 {feature.description}
               </p>
               
               {/* Enhanced accent line */}
               <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 shadow-sm"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    
    {/* Simple bottom accent */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="text-center mt-16"
    >
      <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-full shadow-lg">
        <div className="flex space-x-2 mr-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
        </div>
        <span className="text-gray-700 font-medium">Crafted with passion, delivered with excellence</span>
      </div>
    </motion.div>
  </div>

  {/* Removed complex animations */}
</section>
      

      {/* Coupon Banner */}
      <CouponBanner />

                    {/* Featured Products */}
        <section className="py-6 bg-yellow-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
         
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-20"
           >
  
             
             <h2 className="text-5xl font-black text-gray-900 mb-6">Featured Products</h2>
             <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">Handpicked items just for you, curated with love and care</p>
             
             <motion.div
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="inline-block"
             >
                               <Link
                  to="/shop"
                  className="bg-purple-500 hover:from-blue-600 hover:to-teal-600 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-blue-500/25 hover:scale-105 transform"
                >
                  <Gift size={20} className="mr-2" />
                  View All Products
                  <ArrowRight size={20} className="ml-2" />
                </Link>
             </motion.div>
           </motion.div>
          
                     {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 animate-pulse border border-blue-200/30 shadow-lg"
                 >
                   <div className="bg-gradient-to-br from-blue-100 to-teal-100 h-64 rounded-2xl mb-4"></div>
                   <div className="bg-gradient-to-r from-blue-200 to-teal-200 h-6 rounded mb-3"></div>
                   <div className="bg-gradient-to-r from-blue-200 to-teal-200 h-4 rounded w-3/4 mb-6"></div>
                   <div className="bg-gradient-to-r from-blue-300 to-teal-300 h-8 rounded w-1/2"></div>
                 </motion.div>
               ))}
             </div>
           ) : featuredProducts.length > 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
             >
               {featuredProducts.slice(0, 4).map((product, index) => (
                 <motion.div
                   key={product._id}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6, delay: index * 0.1 }}
                 >
                   <ProductCard 
                     product={product} 
                     colorTheme={['blue', 'teal', 'blue', 'teal'][index % 4]}
                   />
                 </motion.div>
               ))}
             </motion.div>
                       ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 animate-pulse border border-blue-200/30 shadow-lg"
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 h-64 rounded-2xl mb-4"></div>
                    <div className="bg-gradient-to-r from-blue-200 to-teal-200 h-6 rounded mb-3"></div>
                    <div className="bg-gradient-to-r from-blue-200 to-teal-200 h-4 rounded w-3/4 mb-6"></div>
                    <div className="bg-gradient-to-r from-blue-300 to-teal-300 h-8 rounded w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            )}
        </div>
      </section>

             {/* Sale Products */}
       <section className="py-24 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between mb-16"
          >
            <div>
                             <h2 className="text-4xl font-black text-gray-900 mb-6">✨ Special Offers</h2>
                             <p className="text-lg text-gray-600">Limited time deals on amazing lifestyle products</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                             <Link
                 to="/shop"
                 className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
               >
                <Gift size={20} className="mr-2" />
                View All Deals
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 animate-pulse border border-white/50">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-6"></div>
                  <div className="bg-gray-200 h-8 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : saleProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {saleProducts.slice(0, 4).map((product, index) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  showDiscount={true}
                  colorTheme={['orange', 'red', 'pink', 'purple'][index % 4]}
                />
              ))}
            </div>
                     ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 animate-pulse border border-white/50">
                   <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                   <div className="bg-gray-200 h-6 rounded mb-3"></div>
                   <div className="bg-gray-200 h-4 rounded w-3/4 mb-6"></div>
                   <div className="bg-gray-200 h-8 rounded w-1/2"></div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </section>

             {/* Testimonials */}
       <section className="py-24 bg-purple-300 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
                         <h2 className="text-5xl font-black text-gray-800 mb-6">What Our Customers Say</h2>
                           <p className="text-xl text-purple-700 max-w-3xl mx-auto font-medium">Real experiences from real people who love our lifestyle products</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                                 review: "Amazing quality lifestyle products! Perfect for daily use. The packaging was beautiful and delivery was super fast. Highly recommended!",
                rating: 5,
                avatar: "👩‍💼",
                role: "Marketing Manager"
              },
              {
                name: "Arjun Patel",
                                 review: "Fast delivery and beautiful packaging. My wife loved the lifestyle products! The personalized touch made it extra special.",
                rating: 5,
                avatar: "👨‍💻",
                role: "Software Engineer"
              },
              {
                name: "Anjali Desai",
                                 review: "Best lifestyle website ever! Found the perfect products for my daughter. The quality exceeded my expectations.",
                rating: 5,
                avatar: "👩‍🎨",
                role: "Designer"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                                 <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-purple-200/30 hover:shadow-purple-500/20 hover:scale-105 transition-all duration-500 animate-bounce-in h-80 flex flex-col justify-between">
                   <div>
                     <div className="flex items-center mb-6">
                       {[...Array(testimonial.rating)].map((_, i) => (
                         <Star key={i} size={20} className="text-purple-500 fill-current" />
                       ))}
                     </div>
                     <p className="text-gray-700 mb-8 text-lg leading-relaxed font-medium flex-grow">"{testimonial.review}"</p>
                   </div>
                   <div className="flex items-center mt-auto">
                     <div className="text-4xl mr-4">{testimonial.avatar}</div>
                     <div>
                       <div className="font-bold text-purple-800 text-lg">{testimonial.name}</div>
                       <div className="text-purple-600 font-medium">{testimonial.role}</div>
                     </div>
                   </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "50,000+", label: "Happy Customers", icon: Users },
                             { number: "1,000+", label: "Lifestyle Products", icon: Package },
              { number: "500+", label: "Cities Served", icon: Globe },
              { number: "4.9/5", label: "Customer Rating", icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="mb-6">
                                 <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                 <stat.icon size={40} className="text-purple-600" />
               </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-3">{stat.number}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

     
    </div>
  );
};

export default HomePage;