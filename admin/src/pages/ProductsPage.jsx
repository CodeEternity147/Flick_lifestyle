import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package
} from 'lucide-react';
import AddProductModal from '../components/products/AddProductModal';
import SafeImage from '../components/common/SafeImage';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white border border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <SafeImage
            src={product.mainImage?.url || product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover"
            fallback={
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Package size={20} className="text-gray-400" />
              </div>
            }
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 truncate">{product.description}</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            product.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
          
          <span className="text-sm font-medium text-gray-900 w-20 text-right">
            ${product.price?.toFixed(2) || '0.00'}
          </span>
          
          <span className="text-sm text-gray-500 w-16 text-right">
            {product.stock || 0}
          </span>
          
          <div className="flex space-x-1">
            <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
              <Eye size={14} />
            </button>
            <button className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">
              <Edit size={14} />
            </button>
            <button className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-200 p-4">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Filter size={20} />
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredProducts.length} products
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new product.</p>
          </div>
        ) : (
          <div>
            {/* Header row */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12"></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Product</span>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-medium text-gray-700 w-16 text-center">Status</span>
                  <span className="text-sm font-medium text-gray-700 w-20 text-right">Price</span>
                  <span className="text-sm font-medium text-gray-700 w-16 text-right">Stock</span>
                  <span className="text-sm font-medium text-gray-700 w-20 text-center">Actions</span>
                </div>
              </div>
            </div>
            
            {/* Product list */}
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <ProductListItem key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductsPage;
