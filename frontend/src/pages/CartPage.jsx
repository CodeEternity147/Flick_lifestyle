import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart, applyCoupon, removeCoupon } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [removingCoupon, setRemovingCoupon] = useState(false);
  
  const { items, summary, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (productId, currentQuantity, change, variant) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateCartItem({ productId, quantity: newQuantity, variant }));
    } else {
      dispatch(removeFromCart({ productId, variant }));
    }
  };

  const handleRemoveItem = async (productId, variant) => {
    try {
      const result = await dispatch(removeFromCart({ productId, variant }));
      if (removeFromCart.fulfilled.match(result)) {
        toast.success('Item removed from cart');
      } else if (removeFromCart.rejected.match(result)) {
        // Error is already handled by the slice and will show in the error state
        console.error('Error removing from cart:', result.payload);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const handleApplyCoupon = async () => {
    if (couponCode.trim()) {
      try {
        const result = await dispatch(applyCoupon(couponCode.trim()));
        if (applyCoupon.fulfilled.match(result)) {
          toast.success('Coupon applied successfully!');
          setCouponCode('');
          // Force refresh cart to ensure state is updated
          dispatch(fetchCart());
        } else if (applyCoupon.rejected.match(result)) {
          toast.error(result.payload || 'Failed to apply coupon');
        }
      } catch (error) {
        console.error('Error applying coupon:', error);
        toast.error('An error occurred while applying the coupon');
      }
    }
  };

  const handleRemoveCoupon = async () => {
    console.log('handleRemoveCoupon called');
    console.log('Current cart state:', { items: items.length, summary });
    
    // Check if there's actually a coupon applied
    if (summary.discount <= 0) {
      toast.error('No coupon applied to remove');
      return;
    }
    
    setRemovingCoupon(true);
    
    try {
      console.log('Dispatching removeCoupon...');
      const result = await dispatch(removeCoupon());
      console.log('removeCoupon result:', result);
      
      if (removeCoupon.fulfilled.match(result)) {
        console.log('Coupon removed successfully');
        toast.success('Coupon removed successfully');
        // Force refresh cart to ensure state is updated
        setTimeout(() => {
          dispatch(fetchCart());
        }, 100);
      } else if (removeCoupon.rejected.match(result)) {
        console.error('removeCoupon rejected:', result.payload);
        const errorMessage = result.payload || 'Failed to remove coupon';
        toast.error(errorMessage);
        
        // If there's a cart validation error, refresh the cart
        if (errorMessage.includes('validation error') || errorMessage.includes('Invalid cart data')) {
          console.log('Refreshing cart due to validation error');
          setTimeout(() => {
            dispatch(fetchCart());
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error in handleRemoveCoupon:', error);
      toast.error('An error occurred while removing the coupon');
      
      // Refresh cart on any error to ensure consistency
      setTimeout(() => {
        dispatch(fetchCart());
      }, 100);
    } finally {
      setRemovingCoupon(false);
    }
  };





  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingCart size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Please login to view your cart</h2>
            <p className="text-xl text-gray-600 mb-8">You need to be logged in to access your shopping cart.</p>
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-48 rounded-xl mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex space-x-4">
                    <div className="bg-gray-300 h-24 w-24 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="bg-gray-300 h-4 rounded mb-2"></div>
                      <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingCart size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-xl text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 inline-flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Shopping Cart</h1>
              <p className="text-purple-600 font-semibold">
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${JSON.stringify(item.variant)}`} className="flex items-center space-x-4 p-6 border border-purple-200/30 rounded-2xl bg-white/50 backdrop-blur-sm hover:shadow-purple-500/20 transition-all duration-300">
                      <img
                        src={item.product.mainImage?.url || item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{item.product.name}</h3>
                        {item.variant && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.variant.name}: {item.variant.value}
                          </p>
                        )}
                        <p className="text-xl font-black text-purple-600 mt-2">₹{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, -1, item.variant)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, 1, item.variant)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id, item.variant)}
                        className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Coupon Code
                </label>
                {summary.discount > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-bold text-emerald-800">Coupon Applied</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={loading || removingCoupon}
                        className="text-red-600 hover:text-red-800 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {removingCoupon ? 'Removing...' : 'Remove'}
                      </button>

                    </div>
                    <div className="text-sm text-emerald-600 font-semibold">
                      You saved ₹{summary.discount} with your coupon!
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Subtotal ({summary.itemCount} items)</span>
                  <span className="font-bold">₹{summary.subtotal}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{summary.discount}</span>
                  </div>
                )}
                <div className="border-t border-purple-200 pt-4">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span>₹{summary.total}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="block w-full text-center mt-4 text-purple-600 hover:text-purple-700 font-bold transition-colors"
              >
                Continue Shopping
              </Link>




            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
