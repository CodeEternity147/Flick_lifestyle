import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart, Heart, Sparkles, Eye } from 'lucide-react';
import { closeWishlistModal } from '../../store/slices/uiSlice';
import { removeFromWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistModalOpen } = useSelector((state) => state.ui);
  const { items, loading, error } = useSelector((state) => state.wishlist);

  const handleRemoveItem = async (productId) => {
    try {
      const result = await dispatch(removeFromWishlist(productId));
      if (removeFromWishlist.fulfilled.match(result)) {
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      // Check if this is a bundle product that requires customization
      if (product.hasBundleItems) {
        toast.info('This product requires customization. Redirecting to product page...');
        navigate(`/product/${product._id}`);
        dispatch(closeWishlistModal());
        return;
      }
      
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {wishlistModalOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            onClick={() => dispatch(closeWishlistModal())}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative w-full max-w-md glass rounded-2xl shadow-2xl border border-white/20"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Wishlist</h2>
                {items.length > 0 && (
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                    {items.length}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(closeWishlistModal())}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Wishlist Items */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center p-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    <span className="text-gray-600 font-medium">Loading...</span>
                  </div>
                </motion.div>
              ) : items.length > 0 ? (
                <motion.div 
                  className="p-6 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product._id}
                      variants={itemVariants}
                      className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={item.product.mainImage?.url || item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">₹{item.product.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Product Actions */}
                        <div className="flex items-center space-x-2">
                          {item.product.hasBundleItems ? (
                            <Link
                              to={`/product/${item.product._id}`}
                              onClick={() => dispatch(closeWishlistModal())}
                              className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
                            >
                              <Eye size={18} className="animate-pulse" />
                              <span>View Product</span>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item.product)}
                              className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                            >
                              <ShoppingCart size={18} />
                              <span>Add to Cart</span>
                            </button>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-300"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="p-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-rose-400" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-6">Start adding products you love</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(closeWishlistModal())}
                    className="btn-primary inline-flex items-center"
                  >
                    <Sparkles size={18} className="mr-2" />
                    Explore Products
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div 
                className="border-t border-white/20 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/wishlist"
                  onClick={() => dispatch(closeWishlistModal())}
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  View Wishlist
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistModal;
