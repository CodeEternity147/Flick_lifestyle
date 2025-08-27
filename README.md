# Flick Lifestyle - MERN Stack E-commerce Application

A complete MERN stack e-commerce application with user frontend, admin panel, and robust backend API.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations with image uploads via Cloudinary
- **Order Management**: Order creation, tracking, and status updates
- **Cart & Wishlist**: Full cart and wishlist functionality
- **Payment Integration**: Stripe payment gateway integration
- **Coupon System**: Discount coupon management
- **File Upload**: Image uploads with Cloudinary
- **Security**: Password hashing, input validation, rate limiting, CORS protection
- **Analytics**: Sales analytics and dashboard statistics
- **Production Ready**: Optimized for deployment with proper error handling

### Frontend (React + Redux + Tailwind CSS)
- **Modern UI/UX**: Beautiful, responsive design with glassy effects
- **User Authentication**: Login, registration, profile management
- **Product Browsing**: Shop page with filters, search, and pagination
- **Shopping Cart**: Add, remove, update cart items
- **Wishlist**: Save and manage favorite products
- **Checkout Process**: Complete checkout with payment integration
- **Order Tracking**: View order history and track orders
- **Responsive Design**: Mobile-first approach
- **Production Ready**: Optimized build with proper error handling and loading states

### Admin Panel (React + Redux + Tailwind CSS)
- **Secure Admin Login**: Role-based admin authentication
- **Dashboard**: Sales analytics, statistics, and charts
- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: View and update order statuses
- **User Management**: Manage user accounts and permissions
- **Coupon Management**: Create and manage discount coupons
- **Inventory Management**: Track stock levels and low stock alerts

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage and optimization
- **Stripe** - Payment processing
- **Nodemailer** - Email functionality
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **React Intersection Observer** - Scroll animations

### Admin Panel
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
flick-lifestyle/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── config.env         # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Entry point
├── frontend/              # User-facing React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json       # Frontend dependencies
├── admin/                 # Admin panel React app
│   ├── src/
│   │   ├── components/    # Admin components
│   │   ├── pages/         # Admin pages
│   │   ├── store/         # Redux store and slices
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json       # Admin dependencies
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flick-lifestyle
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install Admin Panel Dependencies**
   ```bash
   cd ../admin
   npm install
   ```

### Environment Setup

**Quick Setup (Recommended):**
```bash
# Run the automated setup script
node setup-env.js
```

**Manual Setup:**
1. **Backend Environment Variables**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your actual credentials
   ```

2. **Frontend Environment Variables**
   ```bash
   cd frontend
   cp env.example .env
   # Edit .env with your API URLs
   ```

3. **Admin Panel Environment Variables**
   ```bash
   cd admin
   cp env.example .env
   # Edit .env with your API URLs
   ```

**📖 For detailed environment setup instructions, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)**

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

3. **Start Admin Panel Development Server**
   ```bash
   cd admin
   npm run dev
   ```
   Admin panel will run on: http://localhost:3001

## 🔐 Authentication

### User Authentication
- **Registration**: Users can create accounts with email and password
- **Login**: JWT-based authentication
- **Profile Management**: Update profile information and addresses

### Admin Authentication
- **Admin Login**: Secure admin login with role verification
- **Role-based Access**: Only users with admin role can access admin panel
- **Session Management**: JWT tokens with automatic logout on expiration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/sale` - Get sale products
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Cart & Wishlist
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Admin Endpoints
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/products` - Admin product management
- `GET /api/admin/orders` - Admin order management
- `GET /api/admin/users` - Admin user management
- `GET /api/admin/coupons` - Admin coupon management

## 🎨 UI/UX Features

### Design System
- **Light Theme**: Clean, modern light theme
- **Multi-color Accents**: Blue, purple, and accent colors
- **Glassy Effects**: Backdrop blur and transparency effects
- **Smooth Animations**: Framer Motion animations
- **Responsive Design**: Mobile-first approach

### Components
- **Reusable Components**: Modular component architecture
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for user feedback
- **Modals**: Overlay modals for forms and confirmations

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Express-validator for data validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper CORS setup
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization

## 📱 Responsive Design

- **Mobile-First**: Designed for mobile devices first
- **Tablet Support**: Optimized for tablet screens
- **Desktop Experience**: Enhanced desktop experience
- **Touch-Friendly**: Touch-optimized interactions
- **Cross-Browser**: Compatible with modern browsers

## 🚀 Deployment

The application is production-ready and optimized for deployment. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Start
```bash
# Install all dependencies
npm run install:all

# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Deployment Options
- **Frontend/Admin**: Vercel, Netlify, AWS S3
- **Backend**: Railway, Heroku, DigitalOcean, AWS EC2
- **Database**: MongoDB Atlas (recommended)

### Environment Setup
Copy the example environment files and configure your production variables:
- `backend/env.example` → `backend/.env`
- `frontend/env.example` → `frontend/.env`
- `admin/env.example` → `admin/.env`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking the releases page
- Reading the changelog

---

**Built with ❤️ using the MERN stack**
