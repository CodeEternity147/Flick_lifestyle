import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users,
  ShoppingCart,
  DollarSign,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  // Mock data
  const stats = {
    totalRevenue: 45231,
    totalOrders: 2350,
    totalCustomers: 1234,
    totalProducts: 89,
    revenueChange: '+20.1%',
    ordersChange: '+15.3%',
    customersChange: '+8.2%',
    productsChange: '+12.5%'
  };

  const recentOrders = [
    { id: '001', customer: 'John Doe', product: 'Premium T-Shirt', amount: '89.99', status: 'completed' },
    { id: '002', customer: 'Jane Smith', product: 'Designer Jeans', amount: '129.99', status: 'pending' },
    { id: '003', customer: 'Mike Johnson', product: 'Sneakers', amount: '79.99', status: 'completed' },
    { id: '004', customer: 'Sarah Wilson', product: 'Hoodie', amount: '59.99', status: 'cancelled' }
  ];

  const topProducts = [
    { name: 'Premium T-Shirt', category: 'Clothing', revenue: '12,450', sales: 156 },
    { name: 'Designer Jeans', category: 'Clothing', revenue: '8,920', sales: 89 },
    { name: 'Sneakers', category: 'Footwear', revenue: '6,780', sales: 67 },
    { name: 'Hoodie', category: 'Clothing', revenue: '5,430', sales: 54 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <ArrowUpRight size={16} className="text-green-500 mr-1" />
            ) : (
              <ArrowDownRight size={16} className="text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  const RecentOrderCard = ({ order }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">#{order.id}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{order.customer}</p>
            <p className="text-sm text-gray-500">{order.product}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">${order.amount}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {order.status}
          </span>
        </div>
      </div>
    </div>
  );

  const TopProductCard = ({ product }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 font-medium text-sm">{product.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">${product.revenue}</p>
          <p className="text-sm text-gray-500">{product.sales} sales</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          changeType="increase"
          icon={DollarSign}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={stats.ordersChange}
          changeType="increase"
          icon={ShoppingCart}
          color="bg-green-600"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          change={stats.customersChange}
          changeType="increase"
          icon={Users}
          color="bg-purple-600"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          change={stats.productsChange}
          changeType="increase"
          icon={Package}
          color="bg-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Add Product"
            description="Create a new product listing"
            icon={Package}
            color="bg-blue-600"
            onClick={() => toast.success('Add Product clicked')}
          />
          <QuickActionCard
            title="View Orders"
            description="Check recent orders"
            icon={ShoppingCart}
            color="bg-green-600"
            onClick={() => toast.success('View Orders clicked')}
          />
          <QuickActionCard
            title="Manage Users"
            description="Handle customer accounts"
            icon={Users}
            color="bg-purple-600"
            onClick={() => toast.success('Manage Users clicked')}
          />
          <QuickActionCard
            title="Analytics"
            description="View detailed reports"
            icon={DollarSign}
            color="bg-orange-600"
            onClick={() => toast.success('Analytics clicked')}
          />
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <RecentOrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <TopProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
