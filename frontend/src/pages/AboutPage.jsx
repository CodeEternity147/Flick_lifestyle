import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  Shield, 
  Truck,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  Globe,
  Zap,
  CheckCircle,
  TrendingUp,
  Gift,
  Package
} from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { icon: Users, number: '50,000+', label: 'Happy Customers', color: 'text-blue-600 bg-gradient-to-br from-blue-100 to-indigo-100' },
    { icon: Package, number: '1,000+', label: 'Premium Products', color: 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100' },
    { icon: Globe, number: '500+', label: 'Cities Served', color: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-teal-100' },
    { icon: Star, number: '4.9/5', label: 'Customer Rating', color: 'text-orange-600 bg-gradient-to-br from-orange-100 to-amber-100' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We ensure every product meets our high standards of quality and authenticity.',
      color: 'text-blue-600 bg-gradient-to-br from-blue-100 to-indigo-100'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your products to you as soon as possible.',
      color: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-teal-100'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our customer support team is always ready to help you with any questions.',
      color: 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100'
    },
    {
      icon: Star,
      title: 'Premium Experience',
      description: 'We strive to provide the best shopping experience with premium service.',
      color: 'text-orange-600 bg-gradient-to-br from-orange-100 to-amber-100'
    }
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      bio: 'Passionate about creating exceptional shopping experiences and building a brand that customers love.',
      social: { linkedin: '#', twitter: '#', email: '#' }
    },
    {
      name: 'Arjun Patel',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Ensuring smooth operations and customer satisfaction with innovative solutions.',
      social: { linkedin: '#', twitter: '#', email: '#' }
    },
    {
      name: 'Anjali Desai',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Bringing creativity and innovation to our brand with cutting-edge design strategies.',
      social: { linkedin: '#', twitter: '#', email: '#' }
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'Started with a vision to provide premium lifestyle products',
      icon: Sparkles
    },
    {
      year: '2021',
      title: 'Growth',
      description: 'Expanded to serve 100+ cities across India',
      icon: TrendingUp
    },
    {
      year: '2022',
      title: 'Innovation',
      description: 'Launched customizable corporate bundles and wellness kits',
      icon: Zap
    },
    {
      year: '2024',
      title: 'Excellence',
      description: 'Achieved 50,000+ happy customers and 4.9/5 rating',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
     

      {/* Story Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-black text-gray-900 mb-8">
                Our Story
              </h2>
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Founded in 2020, Flick Lifestyle began with a simple mission: to provide 
                  high-quality lifestyle products that enhance your daily life. What started 
                  as a small online store has grown into a trusted destination for premium 
                  products and exceptional service.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  We believe that everyone deserves access to quality products that make 
                  life better. Our carefully curated selection represents the best brands 
                  and products that we personally love and trust.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Today, we serve thousands of customers across the country, maintaining 
                  the same commitment to quality, service, and customer satisfaction that 
                  inspired us from the beginning.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
                  alt="Our Story"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-300/30 to-transparent"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape the experience 
              we provide to our customers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="text-center p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-purple-200/30 shadow-xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-500 hover:-translate-y-3 animate-slide-up relative overflow-hidden h-80 flex flex-col justify-center">
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon container with enhanced styling */}
                  <div className="relative z-10 flex flex-col h-full justify-center">
                    <div className={`w-24 h-24 ${value.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                      <value.icon size={40} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-md group-hover:text-gray-700 transition-colors duration-300 flex-grow">{value.description}</p>
                    
                    {/* Decorative element */}
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-teal-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that shaped our growth and success over the years.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="text-center p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-blue-200/30 shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-500 hover:-translate-y-3 animate-slide-up relative overflow-hidden h-80 flex flex-col justify-center">
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                      <milestone.icon size={40} className="text-blue-600" />
                    </div>
                    
                    <div className="text-3xl font-black text-blue-600 mb-4">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-md group-hover:text-gray-700 transition-colors duration-300 flex-grow">{milestone.description}</p>
                    
                    {/* Decorative element */}
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mx-auto mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-purple-300 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-gray-800 mb-6">Meet Our Team</h2>
            <p className="text-xl text-purple-700 max-w-3xl mx-auto font-medium">
              The passionate individuals behind Flick Lifestyle who work tirelessly 
              to bring you the best products and service.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-purple-200/30 hover:shadow-purple-500/20 hover:scale-105 transition-all duration-500 animate-bounce-in h-96 flex flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <motion.div
                        className="w-32 h-32 rounded-full mx-auto overflow-hidden shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-2">{member.name}</h3>
                    <p className="text-purple-600 font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-700 leading-relaxed flex-grow">{member.bio}</p>
                  </div>
                  
                  {/* Social links */}
                  <div className="flex justify-center space-x-4 mt-6">
                    {Object.entries(member.social).map(([platform, url]) => (
                      <motion.a
                        key={platform}
                        href={url}
                        className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 hover:text-purple-700 hover:scale-110 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-sm font-bold">{platform.charAt(0).toUpperCase()}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between"
          >
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to Experience Flick Lifestyle?</h2>
              <p className="text-lg text-gray-600">Join thousands of satisfied customers who trust us for their lifestyle needs.</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 md:mt-0"
            >
              <Link
                to="/shop"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
              >
                <Gift size={20} className="mr-2" />
                Start Shopping
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
