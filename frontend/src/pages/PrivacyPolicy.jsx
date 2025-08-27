import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Section */}
      <section className="relative py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="prose prose-lg max-w-none"
          >
            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="mr-3 text-indigo-600" size={28} />
                Information We Collect
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Name, email address, phone number, and shipping address</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Payment information (processed securely through our payment partners)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Order history and preferences</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Communication preferences and feedback</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="mr-3 text-indigo-600" size={28} />
                How We Use Your Information
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Processing</h3>
                    <p className="text-gray-600">To process and fulfill your orders, send order confirmations, and provide customer support.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Communication</h3>
                    <p className="text-gray-600">To send you updates about your orders, promotional offers, and important service announcements.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Personalization</h3>
                    <p className="text-gray-600">To personalize your shopping experience and recommend products that match your interests.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Improvement</h3>
                    <p className="text-gray-600">To improve our website, services, and customer experience based on your feedback and usage patterns.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Database className="mr-3 text-indigo-600" size={28} />
                Information Sharing
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website, processing payments, and delivering orders.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="mr-3 text-indigo-600" size={28} />
                Data Security
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Encryption</h3>
                    <p className="text-gray-600">All sensitive data is encrypted using industry-standard SSL/TLS protocols.</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Secure Storage</h3>
                    <p className="text-gray-600">Your data is stored on secure servers with restricted access.</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Regular Monitoring</h3>
                    <p className="text-gray-600">We continuously monitor our systems for potential security threats.</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Employee Training</h3>
                    <p className="text-gray-600">Our team is trained on data protection and privacy best practices.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="mr-3 text-indigo-600" size={28} />
                Your Rights
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  You have the following rights regarding your personal information:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-indigo-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Access</h3>
                      <p className="text-gray-600">Request access to the personal information we hold about you.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-indigo-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Correction</h3>
                      <p className="text-gray-600">Request correction of inaccurate or incomplete information.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-indigo-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Deletion</h3>
                      <p className="text-gray-600">Request deletion of your personal information, subject to legal requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-indigo-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Opt-out</h3>
                      <p className="text-gray-600">Opt out of marketing communications at any time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="mr-3 text-indigo-600" size={28} />
                Contact Us
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <Mail className="text-indigo-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-gray-600">privacy@flicklifestyle.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-indigo-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Phone</p>
                                             <p className="text-gray-600">+91 8445381703</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
