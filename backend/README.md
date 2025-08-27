# Flick Lifestyle Backend API

A complete Node.js backend API for the Flick Lifestyle e-commerce platform built with Express.js, MongoDB, and JWT authentication.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management, address management
- **Product Management**: CRUD operations, categories, variants, reviews, search
- **Shopping Cart**: Add, update, remove items, apply coupons
- **Wishlist**: Add/remove products to wishlist
- **Order Management**: Create orders, track status, payment integration
- **Payment Integration**: Stripe payment gateway with webhooks
- **Coupon System**: Discount coupons with validation and usage tracking
- **Admin Dashboard**: Analytics, user management, order processing
- **File Upload**: Cloudinary integration for image uploads
- **Security**: Rate limiting, input validation, error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Payment**: Stripe
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- Stripe account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env.example` to `config.env`
   - Update the environment variables with your credentials

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## ⚙️ Environment Variables

Create a `config.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/flick_lifestyle

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URLs
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```
GET /api/products?page=1&limit=12&category=categoryId&brand=brandName&minPrice=100&maxPrice=1000&rating=4&sort=newest&search=keyword
```

#### Get Single Product
```
GET /api/products/:id
```

#### Get Featured Products
```
GET /api/products/featured
```

#### Get Products on Sale
```
GET /api/products/sale
```

#### Search Products
```
GET /api/products/search?q=search_term&limit=10
```

### Cart Endpoints

#### Get User Cart
```
GET /api/cart
Authorization: Bearer <token>
```

#### Add Item to Cart
```
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2,
  "variant": {
    "name": "Size",
    "value": "Large",
    "price": 1500
  }
}
```

#### Update Cart Item
```
PUT /api/cart/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```
DELETE /api/cart/:productId
Authorization: Bearer <token>
```

### Wishlist Endpoints

#### Get User Wishlist
```
GET /api/wishlist
Authorization: Bearer <token>
```

#### Add Item to Wishlist
```
POST /api/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id"
}
```

#### Remove Item from Wishlist
```
DELETE /api/wishlist/:productId
Authorization: Bearer <token>
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "type": "home",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "phone": "9876543210"
  },
  "billingAddress": {
    "type": "home",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "phone": "9876543210"
  },
  "paymentMethod": "stripe",
  "shippingMethod": "standard"
}
```

#### Get User Orders
```
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

#### Get Single Order
```
GET /api/orders/:id
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment Intent
```
POST /api/payment/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id"
}
```

#### Confirm Payment
```
POST /api/payment/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id",
  "paymentIntentId": "pi_xxx"
}
```

### Coupon Endpoints

#### Validate Coupon
```
POST /api/coupons/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE20",
  "orderAmount": 1000
}
```

#### Get Active Coupons
```
GET /api/coupons/active
```

### Admin Endpoints

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get All Users
```
GET /api/admin/users?page=1&limit=20&search=john&role=user&isActive=true
Authorization: Bearer <admin_token>
```

#### Get Sales Analytics
```
GET /api/admin/analytics/sales?period=monthly&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs are validated using express-validator
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Password Hashing**: bcryptjs for password encryption
- **JWT Expiration**: Tokens expire after 7 days

## 📊 Database Models

### User
- Authentication fields (email, password)
- Profile information (name, phone, avatar)
- Addresses array
- Role-based access (user/admin)

### Product
- Basic info (name, description, price)
- Images and variants
- Stock management
- Reviews and ratings
- SEO fields

### Order
- Order items with product details
- Shipping and billing addresses
- Payment information
- Status tracking
- Order history

### Cart
- User-specific cart items
- Quantity management
- Coupon application

### Wishlist
- User's saved products
- Quick add/remove functionality

### Category
- Hierarchical category structure
- SEO optimization
- Product count tracking

### Coupon
- Discount codes with validation
- Usage tracking
- Expiration dates

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up Cloudinary and Stripe production keys
4. Configure proper CORS origins

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## 🔄 Webhooks

### Stripe Webhook
```
POST /api/payment/webhook
```

Configure this endpoint in your Stripe dashboard to handle payment events.

## 📈 Monitoring

- Health check endpoint: `GET /api/health`
- Error logging to console
- Request/response logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.
