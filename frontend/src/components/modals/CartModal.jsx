import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart, ShoppingBag, Gift } from 'lucide-react';
import { closeCartModal } from '../../store/slices/uiSlice';
import { updateCartItem, removeFromCart } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const CartModal = () => {
  const dispatch = useDispatch();
  const { cartModalOpen } = useSelector((state) => state.ui);
  const { items, summary, loading } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart({ productId }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  // Helper function to check if a cart item has bundle items
  const hasBundleItems = (item) => {
    return item.product?.hasBundleItems && (!item.selectedBundleItems || item.selectedBundleItems.length === 0);
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
      {cartModalOpen && (
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
            onClick={() => dispatch(closeCartModal())}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              </div>
              <button
                onClick={() => dispatch(closeCartModal())}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {items.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(closeCartModal())}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.product._id}-${index}`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          {hasBundleItems(item) && (
                            <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                              <Gift size={16} className="text-yellow-600" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {item.product.name}
                          </h3>
                          {hasBundleItems(item) && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Gift size={12} className="text-yellow-600" />
                              <span className="text-xs text-yellow-600 font-medium">
                                Customization required
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-purple-600">₹{summary.total}</span>
                </div>
                
                {/* Warning for bundle items */}
                {items.some(hasBundleItems) && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Gift size={16} className="text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Some items require customization before checkout
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={() => dispatch(closeCartModal())}
                    className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => dispatch(closeCartModal())}
                    className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
