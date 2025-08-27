import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Package, MapPin, CreditCard, Truck, Calendar, Clock, 
  ArrowLeft, CheckCircle, AlertCircle, Clock as ClockIcon,
  Star, Sparkles, Gift, Shield, Zap
} from 'lucide-react';
import { fetchOrderById } from '../store/slices/orderSlice';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'processing':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'shipped':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'confirmed':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} />;
      case 'processing':
        return <Package size={20} />;
      case 'shipped':
        return <Truck size={20} />;
      case 'cancelled':
        return <AlertCircle size={20} />;
      case 'confirmed':
        return <CheckCircle size={20} />;
      default:
        return <ClockIcon size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'cancelled':
        return 'Cancelled';
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'returned':
        return 'Returned';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="animate-pulse"
          >
            <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-6 w-32 rounded-full mb-4"></div>
            <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-8 w-48 rounded-full mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-purple-200/30">
                  <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-6 w-32 rounded-full mb-4"></div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-4 w-full rounded-full"></div>
                    <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-4 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-purple-200/30">
                  <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-6 w-32 rounded-full mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-4 w-full rounded-full"></div>
                    <div className="bg-gradient-to-r from-purple-200 to-pink-200 h-4 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 border border-purple-200/30">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <AlertCircle size={40} className="text-white" />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Order not found</h2>
              <p className="text-gray-600 mb-8 text-lg">The order you're looking for doesn't exist.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/orders"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-purple-500/25"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Orders
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/orders"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Orders
            </Link>
          </motion.div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-purple-200/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">Order Details</h1>
                <p className="text-lg text-gray-600">Order #{currentOrder.orderNumber}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className={`px-6 py-3 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2 ${getStatusColor(currentOrder.orderStatus)}`}
              >
                {getStatusIcon(currentOrder.orderStatus)}
                <span>{getStatusText(currentOrder.orderStatus)}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-purple-200/30"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                  <Package size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Order Timeline</h2>
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900">Order Placed</p>
                    <p className="text-gray-600">
                      {new Date(currentOrder.createdAt).toLocaleDateString()} at {new Date(currentOrder.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
                
                {currentOrder.orderStatus === 'delivered' && currentOrder.deliveredAt && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Truck size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900">Delivered</p>
                      <p className="text-gray-600">
                        {new Date(currentOrder.deliveredAt).toLocaleDateString()} at {new Date(currentOrder.deliveredAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-purple-200/30"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                  <Gift size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Order Items</h2>
              </div>
              
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl border border-purple-200/30 hover:shadow-lg transition-all duration-300 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative overflow-hidden rounded-xl"
                    >
                      <img
                        src={item.image?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIHNhbnMtc2VyaWYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='}
                        alt={item.name}
                        className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-xl text-purple-600">₹{item.price}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-purple-200/30"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                  <MapPin size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl p-6 border border-emerald-200/30">
                <div className="text-gray-700 space-y-2">
                  <p className="font-semibold text-lg">{currentOrder.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{currentOrder.shippingAddress.country}</p>
                  <p className="text-gray-600 font-medium">📞 {currentOrder.shippingAddress.phone}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-purple-200/30 sticky top-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4">
                  <CreditCard size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-purple-200/30">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-lg">₹{currentOrder.subtotal}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-200/30">
                  <span className="text-gray-600 font-medium">Shipping</span>
                  <span className="font-bold text-lg">₹{currentOrder.shippingCost}</span>
                </div>
                {currentOrder.tax > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-purple-200/30">
                    <span className="text-gray-600 font-medium">Tax</span>
                    <span className="font-bold text-lg">₹{currentOrder.tax}</span>
                  </div>
                )}
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-purple-200/30 text-green-600">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold text-lg">-₹{currentOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl px-4">
                  <span className="text-xl font-black text-gray-900">Total</span>
                  <span className="text-2xl font-black text-purple-600">₹{currentOrder.total}</span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-t border-purple-200/30 pt-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Payment Method</h3>
                </div>
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl p-4 border border-indigo-200/30">
                  <p className="text-gray-700 font-medium">{currentOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Tracking Information */}
              {currentOrder.trackingNumber && (
                <div className="border-t border-purple-200/30 pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                      <Truck size={20} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">Tracking Number</h3>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl p-4 border border-blue-200/30">
                    <p className="text-gray-700 font-mono font-medium">{currentOrder.trackingNumber}</p>
                  </div>
                </div>
              )}

              {/* Order Features */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield size={16} className="text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Zap size={16} className="text-yellow-500" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Star size={16} className="text-purple-500" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
