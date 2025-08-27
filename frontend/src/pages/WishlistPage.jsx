import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Sparkles } from 'lucide-react';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const result = await dispatch(removeFromWishlist(productId));
      if (removeFromWishlist.fulfilled.match(result)) {
        toast.success('Removed from wishlist');
      } else if (removeFromWishlist.rejected.match(result)) {
        // Show the error message from the API
        const errorMessage = result.payload || 'Failed to remove item from wishlist';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const result = await dispatch(addToCart({
        productId: product._id,
        quantity: 1
      }));
      
      if (addToCart.fulfilled.match(result)) {
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-48 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-4">
                  <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
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
              <Heart size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-xl text-gray-600 mb-8">Start adding products to your wishlist!</p>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">My Wishlist</h1>
              <p className="text-purple-600 font-semibold">
                {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.product._id} className="group">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 overflow-hidden hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={item.product.mainImage?.url || item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.product._id)}
                    className="absolute top-3 right-3 p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-purple-600 transition-colors">{item.product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{item.product.shortDescription}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-purple-600">₹{item.product.price}</span>
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
