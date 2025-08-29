import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const NotFoundPage = () => {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangle size={48} className="text-white" />
          </div>
          
          <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <Home size={20} className="mr-2" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full border border-purple-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              <ArrowLeft size={20} className="mr-2" />
              Go Back
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Need help? Contact our support team</p>
            <a href="mailto:support@flicklifestyle.com" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
              support@flicklifestyle.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
