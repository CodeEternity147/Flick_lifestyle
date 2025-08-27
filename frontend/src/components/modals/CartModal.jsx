import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart, ShoppingBag } from 'lucide-react';
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
            className="relative w-full max-w-md glass rounded-2xl shadow-2xl border border-white/20"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 font-heading">Shopping Cart</h2>
                {items.length > 0 && (
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                    {items.length}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(closeCartModal())}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center p-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
                      key={`${item.product._id}-${JSON.stringify(item.variant)}`}
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
                        <p className="text-sm text-gray-600">₹{item.price}</p>
                        {item.variant && (
                          <p className="text-xs text-gray-500">
                            {item.variant.name}: {item.variant.value}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                          className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                        >
                          <Minus size={16} />
                        </motion.button>
                        <span className="text-sm font-semibold w-8 text-center bg-gray-100 rounded-lg py-1">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                          className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                        >
                          <Plus size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="p-1.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-300"
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
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="text-gray-400" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some products to get started</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(closeCartModal())}
                    className="btn-primary inline-flex items-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Start Shopping
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Cart Summary */}
            {items.length > 0 && (
              <motion.div 
                className="border-t border-white/20 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{summary.subtotal}</span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-medium">-₹{summary.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                    <span>Total:</span>
                    <span className="gradient-text">₹{summary.total}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/cart"
                    onClick={() => dispatch(closeCartModal())}
                    className="block w-full text-center py-3 px-4 border-2 border-indigo-500 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-300"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => dispatch(closeCartModal())}
                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Checkout
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
