import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  X,
  LogOut,
  Settings,
  Crown,
  ChevronRight
} from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout as logoutAuth } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAuth());
    toast.success('Logged out successfully');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      activeBgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-50'
    },
    {
      name: 'Products',
      href: '/products',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      activeBgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-50'
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      activeBgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-50'
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      activeBgColor: 'bg-orange-100',
      hoverColor: 'hover:bg-orange-50'
    },
    {
      name: 'Coupons',
      href: '/coupons',
      icon: Tag,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      activeBgColor: 'bg-pink-100',
      hoverColor: 'hover:bg-pink-50'
    }
  ];

  return (
    <>
      {/* Mobile backdrop with fade animation */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden bg-black transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Sidebar with slide animation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 lg:relative lg:inset-0 lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with enhanced gradient */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400 to-blue-600 rounded-full transform -translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="flex items-center justify-between relative">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
                  <p className="text-sm text-gray-600 font-medium">Flick Lifestyle</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Navigation with improved spacing */}
          <nav className="flex-1 px-6 pt-8 pb-4 space-y-2 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
                Navigation
              </h2>
              <div className="space-y-2">
                {navigation.map((item, index) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 ease-out transform hover:scale-[1.02] ${
                        isActive
                          ? `${item.activeBgColor} ${item.color} border border-gray-200 shadow-lg shadow-${item.color.split('-')[1]}-100`
                          : `text-gray-700 ${item.hoverColor} hover:text-gray-900 hover:shadow-md`
                      }`
                    }
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      toast.success(`Navigating to ${item.name}`);
                      if (window.innerWidth < 1024) {
                        dispatch(toggleSidebar());
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl transition-all duration-200 group-hover:scale-110 ${
                        ({ isActive }) => isActive ? item.bgColor : 'bg-gray-100 group-hover:bg-white'
                      }`}>
                        <item.icon size={20} className={`${item.color} transition-colors duration-200`} />
                      </div>
                      <span className="font-semibold text-base group-hover:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 opacity-0 group-hover:opacity-100" 
                    />
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer with enhanced design */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
            {/* Admin profile card */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {admin?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {admin?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="space-y-3">
              <button className="group flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-white hover:text-gray-900 rounded-xl transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 group-hover:bg-blue-50 rounded-xl transition-colors duration-200">
                    <Settings size={18} className="group-hover:text-blue-600 transition-colors duration-200" />
                  </div>
                  <span className="text-sm font-medium">Settings</span>
                </div>
                <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 opacity-0 group-hover:opacity-100" />
              </button>
              
              <button
                onClick={handleLogout}
                className="group flex items-center justify-between w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 group-hover:bg-red-200 rounded-xl transition-colors duration-200">
                    <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span className="text-sm font-medium">Logout</span>
                </div>
                <ChevronRight size={14} className="text-red-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-200 opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;