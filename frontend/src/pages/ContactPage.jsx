import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@flicklifestyle.com', 'info@flicklifestyle.com'],
      description: 'Send us an email anytime',
      color: 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 8445381703'],
      description: 'Mon-Fri from 8am to 6pm',
      color: 'text-blue-600 bg-gradient-to-br from-blue-100 to-indigo-100'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Vibhuti Khand, Sector 3', 'Gomti Nagar, Lucknow, India'],
      description: 'Come say hello at our office',
      color: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-teal-100'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
      description: 'Sunday: Closed',
      color: 'text-orange-600 bg-gradient-to-br from-orange-100 to-amber-100'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <section className="relative bg-purple-300 text-white py-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-gray-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-purple-900">
                Get in Touch
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the most convenient way to reach us. We're here to help!
            </p>
          </motion.div>

                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {contactInfo.map((info, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 whileHover={{ y: -8 }}
                 className="group h-full"
               >
                 <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-6 hover:shadow-purple-500/20 transition-all duration-500 h-full flex flex-col">
                   <div className={`inline-flex items-center justify-center w-16 h-16 ${info.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                     <info.icon className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">
                     {info.title}
                   </h3>
                   <div className="space-y-2 mb-4 flex-grow">
                     {info.details.map((detail, idx) => (
                       <p key={idx} className="text-gray-600 font-medium">
                         {detail}
                       </p>
                     ))}
                   </div>
                   <p className="text-sm text-gray-500 mt-auto">
                     {info.description}
                   </p>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Send us a Message
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <div className="flex items-center justify-center">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find quick answers to common questions below.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'How can I track my order?',
                answer: 'You can track your order by logging into your account and visiting the "Orders" section, or by using the tracking number provided in your order confirmation email.'
              },
              {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day return policy for most items. Products must be in their original condition with all tags attached. Please contact our customer service team to initiate a return.'
              },
              {
                question: 'Do you ship internationally?',
                answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check shipping options during checkout.'
              },
              {
                question: 'How can I contact customer support?',
                answer: 'You can reach our customer support team via email at support@flicklifestyle.com, phone at +91 8445381703, or by filling out the contact form above.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 p-6 hover:shadow-purple-500/20 transition-all duration-500">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600">
              Come say hello at our office HQ.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-200/30 overflow-hidden"
          >
            <div className="h-96 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-700 font-semibold text-lg">Interactive Map Coming Soon</p>
                <p className="text-gray-600 mt-2">
                  Vibhuti Khand, Sector 3, Gomti Nagar, Lucknow, India
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
