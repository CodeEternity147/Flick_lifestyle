import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useScrollToTop from '../hooks/useScrollToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Package,
  Weight,
  Ruler,
  Tag,
  CheckCircle,
  Info,
  Zap,
  Globe,
  MapPin,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  TrendingUp
} from 'lucide-react';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { clearBundleState } from '../store/slices/bundleSlice';
import BundleSelector from '../components/bundle/BundleSelector';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedBundleItems, setSelectedBundleItems] = useState([]);
  const [currentBundleSize, setCurrentBundleSize] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { currentProduct, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Memoize the product to prevent unnecessary re-renders
  const memoizedProduct = useMemo(() => currentProduct, [currentProduct?._id]);

  useEffect(() => {
    if (id) {
      setIsTransitioning(true);
      dispatch(fetchProductById(id));
      dispatch(clearBundleState());
      
      // Reset local state when product changes
      setSelectedImage(0);
      setQuantity(1);
      setSelectedVariant(null);
      setActiveTab('description');
      setSelectedBundleItems([]);
      setCurrentBundleSize(5);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct && currentProduct.variants && currentProduct.variants.length > 0) {
      setSelectedVariant(currentProduct.variants[0]);
    }
  }, [currentProduct]);

  // Set transitioning to false when loading completes
  useEffect(() => {
    if (!loading && currentProduct) {
      setIsTransitioning(false);
    }
  }, [loading, currentProduct]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (currentProduct.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    if (!currentProduct._id) {
      toast.error('Invalid product data');
      return;
    }

    if (currentProduct.hasBundleItems) {
      if (selectedBundleItems.length !== currentBundleSize) {
        toast.error(`Please select exactly ${currentBundleSize} items for this product`);
        return;
      }
    }

    try {
      const cartData = {
        productId: currentProduct._id,
        quantity
      };
      
      if (selectedVariant) {
        cartData.variant = selectedVariant;
      }

      if (currentProduct.hasBundleItems) {
        cartData.selectedBundleItems = selectedBundleItems;
      }
      
      const result = await dispatch(addToCart(cartData));
      
      if (addToCart.fulfilled.match(result)) {
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!currentProduct._id) {
      toast.error('Invalid product data');
      return;
    }
    
    const isInWishlist = wishlistItems.some(item => item.product._id === currentProduct._id);
    
    try {
      if (isInWishlist) {
        const result = await dispatch(removeFromWishlist(currentProduct._id));
        if (removeFromWishlist.fulfilled.match(result)) {
          toast.success('Removed from wishlist');
        }
      } else {
        const result = await dispatch(addToWishlist(currentProduct._id));
        if (addToWishlist.fulfilled.match(result)) {
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const isInWishlist = () => {
    return wishlistItems.some(item => item.product._id === currentProduct._id);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentProduct.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProduct.name,
        text: currentProduct.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading || isTransitioning) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image skeleton */}
              <div className="space-y-3">
                <div className="bg-gray-200 h-80 rounded-lg animate-pulse"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded w-3/4 animate-pulse"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2 animate-pulse"></div>
                <div className="bg-gray-200 h-12 rounded w-1/3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-full animate-pulse"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="bg-gray-200 h-12 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-8">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
              <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const images = [currentProduct.mainImage, ...currentProduct.images].filter(Boolean);
  
  // For bundle products, price is calculated dynamically
  const hasFixedPrice = currentProduct.price !== undefined && currentProduct.price !== null;
  const currentPrice = hasFixedPrice ? (selectedVariant?.price || currentProduct.price) : null;
  const originalPrice = hasFixedPrice ? (selectedVariant?.originalPrice || currentProduct.comparePrice) : null;
  const discountPercentage = hasFixedPrice ? (selectedVariant?.discountPercentage || currentProduct.discountPercentage) : 0;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Compact Breadcrumb */}
        <motion.div 
          className="flex items-center space-x-2 text-sm text-gray-600 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button onClick={() => navigate('/shop')} className="hover:text-purple-600">
            Shop
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{currentProduct.name}</span>
        </motion.div>

        {/* Product Details */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="relative mb-3">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]?.url}
                    alt={currentProduct.name}
                    className="w-full h-80 object-cover rounded-lg shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                {discountPercentage > 0 && (
                  <motion.div 
                    className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    -{discountPercentage}% OFF
                  </motion.div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex space-x-2">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded overflow-hidden border-2 ${
                        selectedImage === index 
                          ? 'border-purple-500' 
                          : 'border-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    >
                      <img
                        src={image.url}
                        alt={`${currentProduct.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-2xl font-bold text-gray-900">{currentProduct.name}</h1>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-purple-600 rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 size={16} />
                  </motion.button>
                  <motion.button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded ${
                      isInWishlist()
                        ? 'bg-red-500 text-white'
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={16} fill={isInWishlist() ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                {hasFixedPrice ? (
                  <>
                    <span className="text-3xl font-bold text-purple-600">
                      ₹{currentPrice}
                    </span>
                    {originalPrice > currentPrice && (
                      <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
                    )}
                  </>
                ) : (
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm font-medium text-purple-700">
                      Price calculated based on selected items
                    </span>
                  </div>
                )}
              </div>

              {/* SKU */}
              {currentProduct.sku && (
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-500">SKU:</span>
                  <span className="ml-2 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {currentProduct.sku}
                  </span>
                </div>
              )}

              {/* Variants */}
              {currentProduct.variants && currentProduct.variants.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Select Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.variants.map((variant) => (
                      <motion.button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-2 border rounded text-sm ${
                          selectedVariant?._id === variant._id
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium">{variant.name}: {variant.value}</div>
                        <div className="text-xs text-gray-500">₹{variant.price}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus size={16} />
                  </motion.button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <motion.button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentProduct.stock}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} />
                  </motion.button>
                  <span className="text-sm text-gray-600">
                    {currentProduct.stock} available
                  </span>
                </div>
              </div>

              {/* Bundle Selector */}
              {currentProduct.hasBundleItems && (
                <div className="mb-4">
                  <BundleSelector 
                    productId={currentProduct._id}
                    onSelectionChange={setSelectedBundleItems}
                    onBundleSizeChange={setCurrentBundleSize}
                  />
                </div>
              )}

              {/* Add to Cart */}
              <div className="mb-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0 || (currentProduct.hasBundleItems && selectedBundleItems.length !== currentBundleSize)}
                  className={`w-full py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                    currentProduct.hasBundleItems && selectedBundleItems.length !== currentBundleSize
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart size={18} />
                  <span>
                    {currentProduct.stock === 0 
                      ? 'Out of Stock' 
                      : currentProduct.hasBundleItems && selectedBundleItems.length !== currentBundleSize
                        ? `Select ${currentBundleSize - selectedBundleItems.length} more items`
                        : 'Add to Cart'
                    }
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'description', label: 'Description', icon: Info },
                { id: 'specifications', label: 'Specifications', icon: Package },
                { id: 'features', label: 'Features', icon: Zap },
                { id: 'shipping', label: 'Shipping Info', icon: Truck },
                { id: 'reviews', label: 'Reviews', icon: MessageCircle },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                className="p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'description' && (
                  <div className="text-gray-600 text-sm">
                    {currentProduct.description}
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-2">
                    {currentProduct.specifications?.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900 text-sm">{spec.name}</span>
                        <span className="text-gray-600 text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    {currentProduct.features && currentProduct.features.length > 0 ? (
                      <div className="space-y-2">
                        {currentProduct.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No features listed for this product.</p>
                    )}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Shipping Policy</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} className="text-blue-500" />
                          <span>Free shipping on orders above ₹999</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-blue-500" />
                          <span>Standard delivery: 3-5 business days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {currentProduct.reviews.map((review) => (
                          <div key={review._id} className="border-b border-gray-200 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {review.user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="font-medium text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <MessageCircle size={32} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No reviews yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
