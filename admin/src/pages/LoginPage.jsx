import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Crown, 
  Sparkles, 
  Shield, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { adminLogin, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(adminLogin(formData)).unwrap();
      toast.success('Login successful! Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the slice and shown via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Shield size={20} className="text-green-500" />,
      title: 'Secure Access',
      description: 'Enterprise-grade security for your admin panel'
    },
    {
      icon: <Sparkles size={20} className="text-purple-500" />,
      title: 'Real-time Analytics',
      description: 'Monitor your business performance in real-time'
    },
    {
      icon: <CheckCircle size={20} className="text-blue-500" />,
      title: 'Easy Management',
      description: 'Intuitive interface for managing your store'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Features */}
        <div className="hidden lg:block animate-fade-in">
          <div className="space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                    <Crown size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Flick Lifestyle
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">Admin Panel</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back to your
                </h2>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Command Center
                </h2>
                <p className="text-gray-600 text-lg">
                  Access powerful tools to manage your business operations, track performance, and grow your revenue.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-gray-900">256-bit</div>
                <div className="text-sm text-gray-600">Encryption</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="card max-w-md mx-auto">
            <div className="p-8">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4">
                    <Crown size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles size={12} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                <p className="text-gray-600 mt-2">Sign in to your admin account</p>
              </div>

              {/* Desktop Title */}
              <div className="hidden lg:block mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                <p className="text-gray-600 mt-2">Access your admin dashboard</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:shadow-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:shadow-lg"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full btn btn-primary py-3 text-lg font-semibold relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading || isSubmitting ? (
                      <>
                        <div className="spinner w-5 h-5 mr-3"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Protected by enterprise-grade security
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
