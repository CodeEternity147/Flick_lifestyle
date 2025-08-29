import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Package, 
  ShoppingBag, 
  Gift,
  AlertCircle,
  Info
} from 'lucide-react';
import { 
  fetchBundleConfig, 
  calculateBundlePrice,
  addSelectedItem,
  removeSelectedItem,
  clearSelectedItems,
  setSelectedItems
} from '../../store/slices/bundleSlice';
import toast from 'react-hot-toast';

const BundleSelector = ({ productId, onSelectionChange, onBundleSizeChange }) => {
  const dispatch = useDispatch();
  const { bundleConfig, selectedItems, priceCalculation, loading, error } = useSelector((state) => state.bundle);

  const [customBundleSize, setCustomBundleSize] = useState(5);
  const [showBundleSizeSelector, setShowBundleSizeSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (productId) {
      console.log('🎁 BundleSelector: Fetching config for productId:', productId);
      dispatch(fetchBundleConfig(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedItems.length > 0 && bundleConfig) {
      dispatch(calculateBundlePrice({ productId, selectedItems }));
    }
  }, [dispatch, productId, selectedItems, bundleConfig]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  useEffect(() => {
    if (onBundleSizeChange) {
      onBundleSizeChange(customBundleSize);
    }
  }, [customBundleSize, onBundleSizeChange]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleItemToggle = useCallback(async (item) => {
    if (isProcessing) return; // Prevent multiple rapid clicks
    
    setIsProcessing(true);
    
    // Create a unique identifier for the item
    const itemId = item._id || `${item.category}-${item.name}`;
    
    console.log('🎁 Item clicked:', {
      itemName: item.name,
      itemId: itemId,
      isSelected: selectedItems.includes(itemId),
      currentSelectedCount: selectedItems.length,
      maxAllowed: customBundleSize,
      selectedItems: selectedItems
    });
    
    try {
      if (selectedItems.includes(itemId)) {
        console.log('🎁 Removing item:', itemId);
        await dispatch(removeSelectedItem(itemId));
      } else {
        if (selectedItems.length < customBundleSize) {
          console.log('🎁 Adding item:', itemId);
          await dispatch(addSelectedItem(itemId));
        } else {
          console.log('🎁 Max items reached');
          toast.error(`You can only select ${customBundleSize} items for this bundle`);
        }
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      toast.error('Failed to update selection');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItems, customBundleSize, dispatch, isProcessing]);

  const handleItemClick = useCallback((item) => {
    // Handle clicking on the entire item card
    handleItemToggle(item);
  }, [handleItemToggle]);

  const handleClearSelection = useCallback(async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await dispatch(clearSelectedItems());
    } catch (error) {
      console.error('Error clearing selection:', error);
      toast.error('Failed to clear selection');
    } finally {
      setIsProcessing(false);
    }
  }, [dispatch, isProcessing]);

  const handleSelectAll = useCallback(async () => {
    if (!bundleConfig?.bundleItems || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const maxItems = Math.min(customBundleSize, bundleConfig.bundleItems.length);
      const allItemIds = bundleConfig.bundleItems.slice(0, maxItems).map(item => 
        item._id || `${item.category}-${item.name}`
      );
      
      console.log('🎁 Selecting all items:', allItemIds);
      await dispatch(setSelectedItems(allItemIds));
    } catch (error) {
      console.error('Error selecting all items:', error);
      toast.error('Failed to select all items');
    } finally {
      setIsProcessing(false);
    }
  }, [bundleConfig, customBundleSize, dispatch, isProcessing]);

  const handleSelectCategory = useCallback(async (category) => {
    if (!bundleConfig?.bundleItems || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const categoryItems = bundleConfig.bundleItems.filter(item => item.category === category);
      const categoryItemIds = categoryItems.map(item => 
        item._id || `${item.category}-${item.name}`
      );
      
      // Check if we can add all category items
      const currentCount = selectedItems.length;
      const availableSlots = customBundleSize - currentCount;
      
      if (availableSlots >= categoryItemIds.length) {
        // Add all category items
        const newSelectedItems = [...selectedItems, ...categoryItemIds];
        console.log('🎁 Selecting all items from category:', category, newSelectedItems);
        await dispatch(setSelectedItems(newSelectedItems));
      } else {
        // Add only what we can fit
        const itemsToAdd = categoryItemIds.slice(0, availableSlots);
        const newSelectedItems = [...selectedItems, ...itemsToAdd];
        console.log('🎁 Selecting partial items from category:', category, newSelectedItems);
        await dispatch(setSelectedItems(newSelectedItems));
        toast.info(`Added ${itemsToAdd.length} items from ${category}. Bundle is now full!`);
      }
    } catch (error) {
      console.error('Error selecting category items:', error);
      toast.error('Failed to select category items');
    } finally {
      setIsProcessing(false);
    }
  }, [bundleConfig, selectedItems, customBundleSize, dispatch, isProcessing]);

  const getCategoryIcon = (category) => {
    const icons = {
      'Premium Perfumes': Package,
      'Smartwatches': Package,
      'Leather Wallets': ShoppingBag,
      'Handbags': ShoppingBag,
      'Wireless Earbuds': Package,
      'Executive Pen & Notebook': Package,
      'Grooming Kits': Package,
      'Desk Organizers': Package,
      'Sunglasses': Package,
      'Portable Speakers': Package,
      'Travel Essentials Kit': Package,
      'Laptop Bags': ShoppingBag,
      'Skincare Hampers': Package,
      'Coffee Hampers': Package,
      'Watches': Package,
      'Smart Desk Lamps': Package
    };
    return icons[category] || Package;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Premium Perfumes': 'from-purple-500 to-pink-500',
      'Smartwatches': 'from-blue-500 to-cyan-500',
      'Leather Wallets': 'from-amber-500 to-orange-500',
      'Handbags': 'from-pink-500 to-rose-500',
      'Wireless Earbuds': 'from-green-500 to-emerald-500',
      'Executive Pen & Notebook': 'from-gray-500 to-slate-500',
      'Grooming Kits': 'from-indigo-500 to-purple-500',
      'Desk Organizers': 'from-teal-500 to-cyan-500',
      'Sunglasses': 'from-yellow-500 to-orange-500',
      'Portable Speakers': 'from-red-500 to-pink-500',
      'Travel Essentials Kit': 'from-blue-500 to-indigo-500',
      'Laptop Bags': 'from-green-500 to-teal-500',
      'Skincare Hampers': 'from-pink-500 to-purple-500',
      'Coffee Hampers': 'from-amber-500 to-yellow-500',
      'Watches': 'from-slate-500 to-gray-500',
      'Smart Desk Lamps': 'from-orange-500 to-red-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  if (loading) {
    console.log('🎁 BundleSelector: Loading state');
    return (
      <motion.div 
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 rounded-full mb-4 w-1/3"></div>
          <div className="bg-gray-300 h-4 rounded-full mb-2"></div>
          <div className="bg-gray-300 h-4 rounded-full mb-6 w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!bundleConfig || !bundleConfig.bundleItems || !Array.isArray(bundleConfig.bundleItems)) {
    console.log('🎁 BundleSelector: No bundle config found', { bundleConfig });
    return (
      <motion.div 
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bundle configuration found</p>
        </div>
      </motion.div>
    );
  }

  const categories = [...new Set(bundleConfig.bundleItems.map(item => item.category))];

  console.log('🎁 BundleSelector: Rendering with config', { 
    bundleSize: bundleConfig.bundleSize, 
    itemCount: bundleConfig.bundleItems.length,
    categories 
  });

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Compact Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Bundle Items</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Size:</span>
            <select 
              value={customBundleSize}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setCustomBundleSize(size);
                if (selectedItems.length > size) {
                  dispatch(setSelectedItems(selectedItems.slice(0, size)));
                }
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1"
              disabled={isProcessing}
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                <option key={size} value={size}>{size} items</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Progress */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length}/{customBundleSize} items selected
            </span>
            <div className="flex space-x-2">
              {selectedItems.length === 0 && (
                <motion.button
                  onClick={handleSelectAll}
                  className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded font-medium disabled:opacity-50"
                  disabled={isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Select All
                </motion.button>
              )}
              {selectedItems.length > 0 && (
                <motion.button
                  onClick={handleClearSelection}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-medium disabled:opacity-50"
                  disabled={isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(selectedItems.length / customBundleSize) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Bundle Items List */}
      <div className="space-y-2">
        <AnimatePresence>
          {(bundleConfig.bundleItems || [])
            .map((item, index) => {
              const itemId = item._id || `${item.category}-${item.name}`;
              const isSelected = selectedItems.includes(itemId);
              const Icon = getCategoryIcon(item.category);
              const colorClass = getCategoryColor(item.category);
              
              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  className={`group cursor-pointer ${
                    isSelected ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
                  } ${isProcessing ? 'pointer-events-none opacity-75' : ''}`}
                  onClick={() => handleItemClick(item)}
                  title={isSelected ? 'Click to remove from bundle' : 'Click to add to bundle'}
                >
                  <div className={`bg-white rounded-lg shadow-sm border transition-all duration-300 relative cursor-pointer ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    {/* Horizontal Layout */}
                    <div className="flex items-center p-3">
                      {/* Item Image */}
                      <div className="relative w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0 mr-3">
                        {item.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded">
                            <Icon size={16} className="text-gray-400" />
                          </div>
                        )}
                        
                        {/* Selection Checkbox */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-sm border transition-all duration-300 ${
                            isSelected 
                              ? 'bg-purple-500 border-white' 
                              : 'bg-white border-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemToggle(item);
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          {isSelected ? (
                            <CheckCircle size={10} className="text-white" />
                          ) : (
                            <Circle size={10} className="text-gray-400" />
                          )}
                        </motion.div>
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                isSelected 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {isSelected ? '✓' : 'Click'}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium bg-gradient-to-r ${colorClass} text-white`}>
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-3">
                            <span className="text-sm font-bold text-purple-600">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BundleSelector;
