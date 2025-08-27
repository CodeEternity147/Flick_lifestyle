import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight, Sparkles, Gift, Zap, Copy, Check } from 'lucide-react';
import axios from 'axios';

const CouponBanner = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching active coupons from backend...');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/coupons/active`);
        
        console.log('Backend response:', response.data);
        
        if (response.data.success) {
          const fetchedCoupons = response.data.data.coupons.slice(0, 3); // Show only first 3 coupons
          console.log('Fetched coupons:', fetchedCoupons);
          setCoupons(fetchedCoupons);
        } else {
          console.error('Backend returned success: false');
          setError('Failed to fetch coupons');
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
        setError('Failed to fetch coupons from server');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCoupons();
  }, []);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">No active coupons available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  const gradients = [
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-violet-500 via-purple-500 to-indigo-500',
    'from-orange-500 via-red-500 to-pink-500'
  ];

  const icons = [Gift, Sparkles, Zap];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-950/95 via-gray-900/95 to-gray-950/95"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-xl">
              <Gift className="w-6 h-6 text-white animate-bounce" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3 leading-tight">
              Exclusive Deals
              <span className="block text-xl md:text-2xl bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent font-bold">
                Just For You!
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Unlock incredible savings with our premium coupon codes
            </p>
          </div>
          
          {/* Coupon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {coupons.map((coupon, index) => {
              const IconComponent = icons[index % icons.length];
              console.log(`Rendering coupon ${index}:`, coupon); // Debug log
              
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Card Glow Effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[index]} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse`}></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                    {/* Sparkle Animation */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
                    </div>
                    
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${gradients[index]} rounded-xl shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className={`bg-gradient-to-r ${gradients[index]} px-3 py-1.5 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-105`}>
                        <span className="text-xs font-bold text-white">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                        </span>
                      </div>
                    </div>

                    {/* Coupon Code Section */}
                    <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 rounded-xl p-3 mb-3 border border-gray-600/50 group-hover:bg-gradient-to-r group-hover:from-gray-700/90 group-hover:to-gray-800/90 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-indigo-400" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 mb-0.5">Coupon Code</span>
                            <span className="font-mono text-base md:text-lg font-bold text-white tracking-wider">
                              {coupon.code || 'NO CODE'}
                            </span>
                          </div>
                        </div>
                        <button 
                          className={`text-xs px-2 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-1 ${
                            copiedCode === coupon.code 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30'
                          }`}
                          onClick={() => handleCopyCode(coupon.code)}
                          disabled={!coupon.code}
                        >
                          {copiedCode === coupon.code ? (
                            <>
                              <Check size={12} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-2 text-sm md:text-base font-medium">{coupon.name || 'Special Offer'}</p>
                    
                    {/* Minimum Order */}
                    {coupon.minOrderAmount > 0 && (
                      <div className="inline-flex items-center bg-gray-700/30 px-2 py-1.5 rounded-lg border border-gray-600/30">
                        <span className="text-xs text-gray-400">
                          Min order: <span className="font-semibold text-white">₹{coupon.minOrderAmount}</span>
                        </span>
                      </div>
                    )}

                    {/* Hover Effect Lines */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* CTA Button */}
          <div className="text-center">
            <div className="inline-block relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <Link
                to="/cart"
                className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 transform group-hover:scale-105 shadow-2xl border border-gray-700"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-300 animate-pulse" />
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Start Shopping & Save Big
                </span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            {/* Subtitle */}
            <p className="text-gray-400 mt-3 text-xs">
              Limited time offers • Apply codes at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponBanner;
