import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Sparkles, Heart, Linkedin } from 'lucide-react';

const Footer = () => {
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
    <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-950/95 via-gray-900/95 to-gray-950/95"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info */}
          <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl opacity-75 blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-heading">
                  Flick
                </span>
                <span className="text-sm text-gray-400 -mt-1 font-body">Lifestyle</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-body">
              Discover the latest trends in lifestyle products. From fashion to home decor, 
              we bring you quality products that enhance your daily life with style and comfort.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com/flicklifestyle/", label: "Facebook" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/flick-lifestyle/", label: "Linkedin" },
                { icon: Instagram, href: "https://www.instagram.com/flick_lifestyle/?hl=en", label: "Instagram" }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-indigo-500/30 hover:to-purple-600/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-heading">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/wishlist", label: "Wishlist" }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contact Info
            </h3>
            <div className="space-y-4">
                             {[
                 { icon: MapPin, text: "Vibhuti Khand, Sector 3, Gomti Nagar, Lucknow, India" },
                 { icon: Phone, text: "+91 8445381703" },
                 { icon: Mail, text: "info@flicklifestyle.com" }
               ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-indigo-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                    <contact.icon size={16} className="text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {contact.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
           
                         <p className="text-gray-500 text-sm flex items-center">
               Powered by <a href="https://www.codeeternity.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-semibold ml-1 hover:text-indigo-300 transition-colors duration-300">CodeEternity</a>
             </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms of Service" },
              { to: "/shipping", label: "Shipping Info" }
            ].map((link) => (
              <Link 
                key={link.label}
                to={link.to} 
                className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-y-[-1px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          className="text-center mt-6 pt-6 border-t border-gray-700/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Flick Lifestyle. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
