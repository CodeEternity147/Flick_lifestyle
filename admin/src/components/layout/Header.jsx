import { useSelector, useDispatch } from 'react-redux';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {admin?.name || 'Admin'}!</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>

          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{admin?.email || 'admin@example.com'}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{admin?.name || 'Admin'}</p>
                  <p className="text-sm text-gray-500">{admin?.email || 'admin@example.com'}</p>
                </div>
                
                <div className="p-2">
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">
                    <User size={16} />
                    <span className="text-sm">Profile</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
