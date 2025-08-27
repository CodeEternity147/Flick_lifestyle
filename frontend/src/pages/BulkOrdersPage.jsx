import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowRight,
  Sparkles,
  Truck,
  Users,
  Award,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const BulkOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    const fetchBulkOrderProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products/category/bulk-orders');
        setProducts(response.data.data.products);
      } catch (err) {
        console.error('Error fetching bulk order products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchBulkOrderProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
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

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 overflow-hidden hover:shadow-purple-500/20 transition-all duration-500">
        <div className="relative">
          <motion.img
            src={product.mainImage?.url}
            alt={product.name}
            className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleProductClick(product._id)}
          />
          {product.discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            >
              -{product.discountPercentage}%
            </motion.div>
          )}
          <motion.button
            onClick={() => handleWishlistToggle(product)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg ${
              isInWishlist(product._id)
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white'
            }`}
          >
            <Heart size={18} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
        
        <div className="p-6">
          <h3 
            className="font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer text-lg group-hover:scale-105 transform"
            onClick={() => handleProductClick(product._id)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
          
         
          
                     <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 mb-4">
             <div className="flex items-center justify-between text-sm">
               <span className="text-purple-700 font-semibold">
                 Min Order: {product.specifications?.find(spec => spec.name === 'Min Order Quantity')?.value || 'Contact us'}
               </span>
               <span className="text-purple-600 font-bold">
                 {product.specifications?.find(spec => spec.name === 'Bulk Discount')?.value || 'Volume discounts available'}
               </span>
             </div>
           </div>
          
        
          
          <div className="flex space-x-3">
            <motion.button
              onClick={() => handleAddToCart(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/25"
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => handleProductClick(product._id)}
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-gray-500/25"
              >
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Bulk Orders</h1>
              <p className="text-purple-600 font-semibold">Premium corporate solutions for large-scale orders</p>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-8 mb-8"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Why Choose Our Bulk Orders?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Truck size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on all bulk orders above ₹50,000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Volume Discounts</h3>
              <p className="text-gray-600">Up to 30% discount on large quantity orders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-600">Personal account manager for bulk orders</p>
            </div>
          </div>
        </motion.div>

                 {/* Products Grid */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
         >
           {loading ? (
             <div className="flex items-center justify-center py-12">
               <div className="flex items-center space-x-3">
                 <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                 <span className="text-lg font-semibold text-gray-600">Loading products...</span>
               </div>
             </div>
           ) : error ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <TrendingUp className="w-8 h-8 text-red-600" />
               </div>
               <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
               <p className="text-gray-600 mb-4">{error}</p>
               <button
                 onClick={() => window.location.reload()}
                 className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-all duration-300"
               >
                 Try Again
               </button>
             </div>
           ) : products.length === 0 ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Package className="w-8 h-8 text-gray-600" />
               </div>
               <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
               <p className="text-gray-600">No bulk order products are currently available.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {products.map((product, index) => (
                 <ProductCard key={product._id} product={product} index={index} />
               ))}
             </div>
           )}
         </motion.div>
      </div>
    </div>
  );
};

export default BulkOrdersPage;
