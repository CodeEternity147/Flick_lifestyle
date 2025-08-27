import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, Sparkles } from 'lucide-react';
import { closeSearchModal } from '../../store/slices/uiSlice';
import { searchProducts } from '../../store/slices/productSlice';
import { Link } from 'react-router-dom';

const SearchModal = () => {
  const dispatch = useDispatch();
  const { searchModalOpen } = useSelector((state) => state.ui);
  const { products, loading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        dispatch(searchProducts(searchQuery));
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, dispatch]);

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

  return (
    <AnimatePresence>
      {searchModalOpen && (
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
            onClick={() => dispatch(closeSearchModal())}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative w-full max-w-2xl glass rounded-2xl shadow-2xl border border-white/20"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Search Products</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(closeSearchModal())}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Search Input */}
            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center p-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-3">
                    <Loader2 className="animate-spin text-indigo-600" size={24} />
                    <span className="text-gray-600 font-medium">Searching...</span>
                  </div>
                </motion.div>
              ) : searchQuery.trim() ? (
                products.length > 0 ? (
                  <motion.div 
                    className="p-6 space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={`/product/${product._id}`}
                          onClick={() => dispatch(closeSearchModal())}
                          className="flex items-center space-x-4 p-4 hover:bg-white/50 rounded-xl transition-all duration-300 group"
                        >
                          <div className="relative overflow-hidden rounded-xl">
                            <img
                              src={product.mainImage?.url || product.images[0]?.url}
                              alt={product.name}
                              className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {product.shortDescription}
                            </p>
                            <p className="text-lg font-bold gradient-text mt-2">
                              ₹{product.price}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="p-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-600 font-medium">No products found for "{searchQuery}"</p>
                    <p className="text-sm text-gray-500 mt-2">Try different keywords or browse our categories</p>
                  </motion.div>
                )
              ) : (
                <motion.div 
                  className="p-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="text-indigo-600" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Amazing Products</h3>
                  <p className="text-gray-600">Start typing to search for products</p>
                  <div className="mt-6 grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    {['Fashion', 'Electronics', 'Home', 'Beauty'].map((category) => (
                      <div key={category} className="text-xs text-gray-500 bg-gray-100 rounded-lg py-2 px-3">
                        {category}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
