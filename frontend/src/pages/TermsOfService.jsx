import { motion } from 'framer-motion';
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Clock, Users, Mail, Phone } from 'lucide-react';

const TermsOfService = () => {
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
      <section className="relative py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. By using Flick Lifestyle, you agree to these terms.
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
                <Scale className="mr-3 text-purple-600" size={28} />
                Acceptance of Terms
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  By accessing and using Flick Lifestyle's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Notice</h3>
                  <p className="text-gray-600">
                    These terms constitute a legally binding agreement between you and Flick Lifestyle regarding your use of our services.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="mr-3 text-purple-600" size={28} />
                User Accounts and Registration
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Creation</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                        <span>You must provide accurate and complete information when creating an account</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                        <span>You are responsible for maintaining the confidentiality of your account credentials</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                        <span>You must be at least 18 years old to create an account</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Responsibilities</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <XCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                        <span>Do not share your account credentials with others</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                        <span>Do not use false or misleading information</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                        <span>Do not create multiple accounts for fraudulent purposes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="mr-3 text-purple-600" size={28} />
                Product Information and Orders
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Descriptions</h3>
                    <p className="text-gray-600 mb-4">
                      We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions are accurate, complete, or current.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Product images are for illustration purposes only</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Prices are subject to change without notice</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Product availability is not guaranteed</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Processing</h3>
                    <p className="text-gray-600 mb-4">
                      All orders are subject to acceptance and availability. We reserve the right to refuse any order.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Orders are confirmed via email</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Payment must be completed before order processing</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>We may cancel orders for any reason</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="mr-3 text-purple-600" size={28} />
                Shipping and Delivery
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Times</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-2">Standard Delivery</h4>
                        <p className="text-gray-600 text-sm">3-5 business days</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-2">Express Delivery</h4>
                        <p className="text-gray-600 text-sm">1-2 business days</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-2">Same Day</h4>
                        <p className="text-gray-600 text-sm">Available in select cities</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Terms</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Delivery times are estimates and may vary based on location and circumstances</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Risk of loss and title pass to you upon delivery</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>You are responsible for providing accurate delivery information</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="mr-3 text-purple-600" size={28} />
                Returns and Refunds
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Return Policy</h3>
                    <p className="text-gray-600 mb-4">
                      We accept returns within 30 days of delivery for most items. Some restrictions apply.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Eligible for Returns</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                            <span>Unused items in original packaging</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                            <span>Defective or damaged items</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                            <span>Wrong items received</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Not Eligible</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <XCircle className="text-red-500 mr-2 mt-1" size={16} />
                            <span>Personalized or custom items</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="text-red-500 mr-2 mt-1" size={16} />
                            <span>Used or damaged items</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="text-red-500 mr-2 mt-1" size={16} />
                            <span>Perishable goods</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund Process</h3>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-l-4 border-green-500">
                      <p className="text-gray-600">
                        Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to the original payment method used for the purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="mr-3 text-purple-600" size={28} />
                Limitation of Liability
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  Flick Lifestyle shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, incurred by you or any third party.
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Disclaimer</h3>
                  <p className="text-gray-600">
                    Our total liability to you for any claims arising from the use of our services shall not exceed the amount you paid for the specific product or service giving rise to the claim.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="mr-3 text-purple-600" size={28} />
                Changes to Terms
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Notification</h3>
                  <p className="text-gray-600">
                    We will notify users of significant changes via email or through our website. Your continued use of our services after changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="mr-3 text-purple-600" size={28} />
                Contact Information
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-gray-600 mb-6">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <Mail className="text-purple-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-gray-600">legal@flicklifestyle.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-purple-600 mr-3" size={20} />
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

export default TermsOfService;
