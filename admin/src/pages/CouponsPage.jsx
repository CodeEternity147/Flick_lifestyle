import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchCoupons, deleteCoupon, toggleCouponStatus } from '../store/slices/couponSlice';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Tag,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Download,
  Filter
} from 'lucide-react';
import AddCouponModal from '../components/coupons/AddCouponModal';

const CouponsPage = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => state.coupons);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        toast.loading('Loading coupons...', { id: 'coupons-loading' });
        await dispatch(fetchCoupons());
        toast.success('Coupons loaded successfully!', { id: 'coupons-loading' });
      } catch (error) {
        toast.error('Failed to load coupons', { id: 'coupons-loading' });
      }
    };
    
    loadCoupons();
  }, [dispatch]);

  const handleToggleStatus = async (couponId) => {
    try {
      const result = await dispatch(toggleCouponStatus(couponId));
      if (toggleCouponStatus.fulfilled.match(result)) {
        toast.success('Coupon status updated successfully');
      } else {
        toast.error(result.payload || 'Failed to update coupon status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const result = await dispatch(deleteCoupon(couponId));
        if (deleteCoupon.fulfilled.match(result)) {
          toast.success('Coupon deleted successfully');
        } else {
          toast.error(result.payload || 'Failed to delete coupon');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard!');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) return 'inactive';
    if (now < validFrom) return 'upcoming';
    if (now > validUntil) return 'expired';
    if (coupon.usedCount >= coupon.usageLimit) return 'limit-reached';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'inactive': return 'from-gray-500 to-gray-600';
      case 'expired': return 'from-red-500 to-pink-500';
      case 'upcoming': return 'from-blue-500 to-cyan-500';
      case 'limit-reached': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <XCircle size={16} />;
      case 'expired': return <Clock size={16} />;
      case 'upcoming': return <Calendar size={16} />;
      case 'limit-reached': return <AlertCircle size={16} />;
      default: return <XCircle size={16} />;
    }
  };

  const filteredCoupons = coupons?.filter(coupon => {
    const matchesSearch = coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || getCouponStatus(coupon) === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  const CouponCard = ({ coupon, index }) => {
    const status = getCouponStatus(coupon);
    
    return (
      <div 
        className="card hover-lift animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getStatusColor(status)}`}>
                  <Tag size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{coupon.code}</h3>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Valid: {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{coupon.usedCount}/{coupon.usageLimit} used</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopyCode(coupon.code)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover-scale"
                title="Copy code"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => handleToggleStatus(coupon._id)}
                className={`p-2 rounded-lg transition-all duration-300 hover-scale ${
                  coupon.isActive 
                    ? 'text-green-600 hover:bg-green-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={coupon.isActive ? 'Deactivate' : 'Activate'}
              >
                {coupon.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              </button>
              <button
                onClick={() => handleDeleteCoupon(coupon._id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover-scale"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50">
              <p className="text-xs text-blue-600 font-medium">Discount</p>
              <p className="text-lg font-bold text-blue-900">
                {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
              <p className="text-xs text-green-600 font-medium">Min Order</p>
              <p className="text-lg font-bold text-green-900">₹{coupon.minOrderAmount}</p>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
              <p className="text-xs text-purple-600 font-medium">Max Discount</p>
              <p className="text-lg font-bold text-purple-900">₹{coupon.maxDiscount}</p>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200/50">
              <p className="text-xs text-orange-600 font-medium">Usage</p>
              <p className="text-lg font-bold text-orange-900">{coupon.usedCount}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-full bg-gradient-to-r ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
              </div>
              <span className={`text-sm font-semibold capitalize ${
                status === 'active' ? 'text-green-700' :
                status === 'inactive' ? 'text-gray-700' :
                status === 'expired' ? 'text-red-700' :
                status === 'upcoming' ? 'text-blue-700' :
                'text-orange-700'
              }`}>
                {status.replace('-', ' ')}
              </span>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(coupon.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
            
            {/* Coupons Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="grid grid-cols-2 gap-3">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-16 bg-gray-200 rounded-lg"></div>
                      ))}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="card animate-fade-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Coupons Management
                </h1>
                <p className="text-gray-600 mt-2">Create and manage discount coupons for your customers</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Tag size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                  <p className="text-lg font-bold text-gray-900">{coupons?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative group">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" size={20} />
                <input
                  type="text"
                  placeholder="Search coupons by code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:shadow-lg"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="limit-reached">Limit Reached</option>
                </select>

                <button className="btn btn-outline">
                  <Filter size={16} className="mr-2" />
                  Filters
                </button>

                <button className="btn btn-outline">
                  <Download size={16} className="mr-2" />
                  Export
                </button>

                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Add Coupon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <AlertCircle size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error Loading Coupons</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCoupons.map((coupon, index) => (
            <CouponCard key={coupon._id || index} coupon={coupon} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCoupons.length === 0 && !loading && (
          <div className="card animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Get started by creating your first coupon'
                }
              </p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Coupon
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      <AddCouponModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default CouponsPage;
