import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchUsers } from '../store/slices/userSlice';

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        toast.loading('Loading users...', { id: 'users-loading' });
        await dispatch(fetchUsers());
        toast.success('Users loaded successfully!', { id: 'users-loading' });
      } catch (error) {
        toast.error('Failed to load users', { id: 'users-loading' });
      }
    };
    
    loadUsers();
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
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage user accounts</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">
            Users management interface will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
