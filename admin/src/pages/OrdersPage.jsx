import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchOrders } from '../store/slices/orderSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        toast.loading('Loading orders...', { id: 'orders-loading' });
        await dispatch(fetchOrders());
        toast.success('Orders loaded successfully!', { id: 'orders-loading' });
      } catch (error) {
        toast.error('Failed to load orders', { id: 'orders-loading' });
      }
    };
    
    loadOrders();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">
            Orders management interface will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
