import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import useScrollToTop from '../hooks/useScrollToTop';
import { motion } from 'framer-motion';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  Star, 
  ShoppingCart, 
  Heart,
  Search,
  X,
  ArrowRight,
  Sparkles,
  Gift,
  Eye
} from 'lucide-react';
import { fetchProducts, fetchCategories, setFilters, clearFilters, setCurrentPage } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ShopPage = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  const { products, categories, loading, pagination, filters } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Get URL params
  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';

  // Sync searchQuery with URL parameter
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const currentFilters = {
      page,
      category,
      sort,
      minPrice,
      maxPrice,
      search,
      limit: 12
    };
    
    dispatch(setFilters(currentFilters));
    dispatch(fetchProducts(currentFilters));
  }, [dispatch, page, category, sort, minPrice, maxPrice, search]);

  const handleFilterChange = (key, value) => {
    setIsFiltering(true);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to page 1 when filters change
    setSearchParams(newParams);
    
    // Reset filtering state after a short delay
    setTimeout(() => setIsFiltering(false), 500);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        setIsSearching(true);
        timeoutId = setTimeout(() => {
          if (query.trim()) {
            handleFilterChange('search', query.trim());
          } else {
            handleFilterChange('search', '');
          }
          setIsSearching(false);
        }, 300); // 300ms delay for better responsiveness
      };
    })(),
    [handleFilterChange]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleFilterChange('search', searchQuery.trim());
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If the search is cleared, immediately update
    if (!value.trim()) {
      handleFilterChange('search', '');
    } else {
      debouncedSearch(value);
    }
  };

  const handleClearFilters = () => {
    setIsFiltering(true);
    setSearchParams({});
    setSearchQuery('');
    dispatch(clearFilters());
    
    // Reset filtering state after a short delay
    setTimeout(() => setIsFiltering(false), 500);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Validate product ID
    if (!product._id) {
      toast.error('Invalid product data');
      return;
    }
    
    // Check if this is a bundle product that requires customization
    if (product.hasBundleItems) {
      toast.info('This product requires customization. Redirecting to product page...');
      navigate(`/product/${product._id}`);
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
    
    // Validate product ID
    if (!product._id) {
      toast.error('Invalid product data');
      return;
    }
    
    console.log('Toggling wishlist for product:', product._id, product.name);
    
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
          <Link to={`/product/${product._id}`}>
            <motion.img
              src={product.mainImage?.url || product.images[0]?.url}
              alt={product.name}
              className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
              whileHover={{ scale: 1.05 }}
            />
          </Link>
          {product.discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            >
              -{product.discountPercentage}%
            </motion.div>
          )}
                           {product.hasBundleItems && (
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 0.2 }}
                     className="absolute top-3 right-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                   >
                     Customize
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
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer text-lg group-hover:scale-105 transform">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
          {product.hasBundleItems && (
            <div className="flex items-center space-x-2 mb-3">
              <Gift size={16} className="text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">
                Customize {product.bundleSize} items
              </span>
            </div>
          )}
         
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {product.price !== undefined && product.price !== null ? (
                <>
                  <span className="text-xl font-black text-purple-600">₹{product.price}</span>
                  {product.comparePrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">₹{product.comparePrice}</span>
                  )}
                </>
              ) : (
                <span className="text-lg font-medium text-gray-600">
                  Price based on selection
                </span>
              )}
            </div>
          </div>
          
          {/* Product Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2 w-full">
              {product.hasBundleItems ? (
                <Link
                  to={`/product/${product._id}`}
                  className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
                >
                  <Eye size={18} className="animate-pulse" />
                  <span>View Product</span>
                </Link>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ProductListItem = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ x: 8 }}
      className="group"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-6 hover:shadow-purple-500/20 transition-all duration-500">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Link to={`/product/${product._id}`}>
              <motion.img
                src={product.mainImage?.url || product.images[0]?.url}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-xl cursor-pointer group-hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
            {product.discountPercentage > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                -{product.discountPercentage}%
              </motion.div>
            )}
            {product.hasBundleItems && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                Customize
              </motion.div>
            )}
          </div>
          
          <div className="flex-1">
            <Link to={`/product/${product._id}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors cursor-pointer group-hover:scale-105 transform">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-600 mb-4 leading-relaxed">{product.shortDescription}</p>
                             {product.hasBundleItems && (
                   <div className="flex items-center space-x-2 mb-3">
                     <Gift size={16} className="text-purple-600" />
                     <span className="text-sm text-purple-600 font-medium">
                       Customize {product.bundleSize} items
                     </span>
                   </div>
                 )}
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(product.averageRating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2 font-medium">
                ({product.numReviews || 0})
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {product.price !== undefined && product.price !== null ? (
                  <>
                    <span className="text-2xl font-black text-purple-600">₹{product.price}</span>
                    {product.comparePrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">₹{product.comparePrice}</span>
                    )}
                  </>
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    Price based on selection
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => handleWishlistToggle(product)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl transition-all duration-300 shadow-lg ${
                    isInWishlist(product._id)
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-red-500 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                </motion.button>
                {product.hasBundleItems ? (
                  <Link
                    to={`/product/${product._id}`}
                    className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
                  >
                    <Eye size={18} className="animate-pulse" />
                    <span>View Product</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
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
              <Gift size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Shop</h1>
              <p className="text-purple-600 font-semibold">Discover our amazing collection of products</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
                         <form onSubmit={handleSearch} className="flex-1 max-w-md">
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                 <input
                   type="text"
                   placeholder="Search products..."
                   value={searchQuery}
                   onChange={handleSearchInputChange}
                   className="w-full pl-12 pr-16 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                 />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        handleFilterChange('search', '');
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-purple-400 hover:text-purple-600 transition-colors"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                  {isSearching ? (
                    <div className="p-2 text-purple-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    </div>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      <Search size={16} />
                    </motion.button>
                  )}
                </div>
              </div>
            </form>

            {/* View Mode and Filters */}
            <div className="flex items-center space-x-4">
              {/* View Mode */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-white shadow-lg text-purple-600' : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <Grid size={20} />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-white shadow-lg text-purple-600' : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <List size={20} />
                </motion.button>
              </div>

                             {/* Filters Button */}
               <motion.button
                 onClick={() => setShowFilters(!showFilters)}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className={`flex items-center space-x-2 px-6 py-3 border border-purple-200 rounded-xl hover:bg-purple-50 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                   isFiltering ? 'animate-pulse' : ''
                 }`}
               >
                 <Filter size={20} className="text-purple-600" />
                 <span className="font-semibold text-gray-700">
                   {isFiltering ? 'Applying...' : 'Filters'}
                 </span>
                 <motion.div
                   animate={{ rotate: showFilters ? 180 : 0 }}
                   transition={{ duration: 0.3 }}
                 >
                   <ChevronDown size={16} className="text-purple-600" />
                 </motion.div>
               </motion.button>

              {/* Clear Filters */}
              {(category || sort !== 'newest' || minPrice || maxPrice || search) && (
                <motion.button
                  onClick={handleClearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-red-600 hover:text-red-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                >
                  Clear All
                </motion.button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-6 border-t border-purple-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-2">
            <Sparkles size={20} className="text-purple-600" />
            <p className="text-gray-700 font-semibold">
              {search ? (
                <>
                  Search results for "{search}": {products.length} of {pagination.total} products
                </>
              ) : category || minPrice || maxPrice || sort !== 'newest' ? (
                <>
                  Filtered results: {products.length} of {pagination.total} products
                </>
              ) : (
                <>
                  Showing {products.length} of {pagination.total} products
                </>
              )}
            </p>
          </div>
        </motion.div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 animate-pulse"
              >
                <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4"></div>
              </motion.div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product, index) => (
              viewMode === 'grid' ? (
                <ProductCard key={product._id} product={product} index={index} />
              ) : (
                <ProductListItem key={product._id} product={product} index={index} />
              )
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 animate-pulse"
              >
                <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4"></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex items-center justify-center"
          >
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => handleFilterChange('page', page - 1)}
                disabled={!pagination.hasPrevPage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-purple-200 rounded-xl text-gray-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white/50 backdrop-blur-sm"
              >
                Previous
              </motion.button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => handleFilterChange('page', pageNum)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`px-4 py-2 border rounded-xl transition-all duration-300 ${
                      pageNum === page
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-lg'
                        : 'border-purple-200 text-gray-700 hover:bg-purple-50 bg-white/50 backdrop-blur-sm'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              <motion.button
                onClick={() => handleFilterChange('page', page + 1)}
                disabled={!pagination.hasNextPage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-purple-200 rounded-xl text-gray-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white/50 backdrop-blur-sm"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
