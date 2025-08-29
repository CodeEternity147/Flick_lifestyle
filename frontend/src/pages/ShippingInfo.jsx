import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, CheckCircle, AlertTriangle, Star, Mail, Phone } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const ShippingInfo = () => {
  useScrollToTop();
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

  const shippingOptions = [
    {
      name: "Standard Delivery",
      time: "3-5 business days",
      price: "₹99",
      freeThreshold: "₹999",
      icon: Truck,
      color: "from-blue-500 to-indigo-600",
      features: ["Tracking available", "Email notifications", "Signature required"]
    },
    {
      name: "Express Delivery",
      time: "1-2 business days",
      price: "₹199",
      freeThreshold: "₹1499",
      icon: Clock,
      color: "from-purple-500 to-pink-600",
      features: ["Priority processing", "Real-time tracking", "SMS updates"]
    },
    {
      name: "Same Day Delivery",
      time: "Same day (by 8 PM)",
      price: "₹299",
      freeThreshold: "₹1999",
      icon: Star,
      color: "from-orange-500 to-red-600",
      features: ["Available in select cities", "Order by 12 PM", "Premium handling"]
    }
  ];

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Truck size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Shipping Information
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fast, reliable, and secure delivery to your doorstep. Choose the shipping option that works best for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Options Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Options</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We offer multiple shipping options to ensure your premium lifestyle products reach you quickly and safely.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-16">
              {shippingOptions.map((option, index) => (
                <div key={option.name} className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon size={28} className="text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{option.name}</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Delivery Time:</span>
                        <span className="font-semibold text-gray-900">{option.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Shipping Cost:</span>
                        <span className="font-semibold text-gray-900">{option.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Free above:</span>
                        <span className="font-semibold text-green-600">₹{option.freeThreshold}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {option.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="text-green-500 mr-3" size={16} />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Delivery Areas Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <MapPin className="mr-3 text-blue-600" size={32} />
                Delivery Areas
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We deliver to major cities across India. Check if we serve your area.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Major Cities We Serve</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {cities.map((city, index) => (
                      <div key={city} className="flex items-center">
                        <CheckCircle className="text-green-500 mr-3" size={16} />
                        <span className="text-gray-700">{city}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Delivery Coverage</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Metro Cities</h4>
                      <p className="text-gray-600 text-sm">Same day delivery available in major metro cities</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Tier 2 Cities</h4>
                      <p className="text-gray-600 text-sm">Express delivery (1-2 days) available</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Other Areas</h4>
                      <p className="text-gray-600 text-sm">Standard delivery (3-5 days) available</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tracking and Updates Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Order Tracking & Updates</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Stay informed about your order with real-time tracking and notifications.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Package size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>Track your package from warehouse to doorstep</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>Get estimated delivery times</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>View delivery status updates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>Receive delivery notifications</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <Mail size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Communication</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>Order confirmation emails</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>Shipping notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>Delivery updates via SMS</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1" size={16} />
                    <span>Customer support assistance</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Important Information Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <AlertTriangle className="mr-3 text-orange-600" size={32} />
                Important Information
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Before Delivery</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Ensure someone is available to receive the package</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Provide accurate delivery address and contact number</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Keep ID proof ready for verification</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">During Delivery</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Inspect package before signing</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Report any damage immediately</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Keep delivery receipt for reference</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Holiday & Peak Season Information</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Peak Seasons</h4>
                    <p className="text-gray-600 text-sm">
                      During festivals and peak seasons (Diwali, Christmas, New Year), delivery times may be extended by 1-2 days.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Weather Conditions</h4>
                    <p className="text-gray-600 text-sm">
                      Delivery may be delayed due to adverse weather conditions. We'll keep you updated via SMS and email.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help with Shipping?</h2>
              <p className="text-lg text-gray-600">
                Our customer support team is here to help with any shipping-related questions.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-center">
                  <Mail className="text-blue-600 mr-3" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">Email Support</p>
                    <p className="text-gray-600">shipping@flicklifestyle.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="text-blue-600 mr-3" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">Phone Support</p>
                                         <p className="text-gray-600">+91 8445381703</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-center">
                  <strong>Support Hours:</strong> Monday to Saturday, 9:00 AM - 8:00 PM IST
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShippingInfo;
