# Environment Setup Guide

This guide will help you set up environment variables for the Flick Lifestyle project to replace hardcoded credentials.

## 🚀 Quick Setup

Run the setup script to automatically create environment files:

```bash
node setup-env.js
```

## 📁 Environment Files Structure

```
flick-lifestyle/
├── backend/
│   ├── .env                 # Backend environment variables (create from env.example)
│   └── env.example         # Backend environment template
├── frontend/
│   ├── .env                # Frontend environment variables (create from env.example)
│   └── env.example        # Frontend environment template
├── admin/
│   ├── .env               # Admin panel environment variables (create from env.example)
│   └── env.example       # Admin panel environment template
└── setup-env.js          # Setup script
```

## 🔧 Backend Environment Variables

Create `backend/.env` from `backend/env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Frontend and Admin URLs (for CORS)
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=20971520
```

## 🎨 Frontend Environment Variables

Create `frontend/.env` from `frontend/env.example`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Flick Lifestyle
VITE_APP_VERSION=1.0.0

# Cloudinary Configuration (if needed for direct uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

## 👨‍💼 Admin Panel Environment Variables

Create `admin/.env` from `admin/env.example`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Flick Lifestyle Admin
VITE_APP_VERSION=1.0.0

# Admin Configuration
VITE_ADMIN_DASHBOARD_TITLE=Flick Lifestyle Admin Panel
VITE_ADMIN_ITEMS_PER_PAGE=10

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ADVANCED_FEATURES=true
```

## 🔒 Security Best Practices

### 1. Never Commit .env Files
Add the following to your `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Use Strong Secrets
- Generate strong JWT secrets (at least 32 characters)
- Use unique secrets for each environment
- Consider using a password manager for production secrets

### 3. Environment-Specific Configurations
- Use different configurations for development, staging, and production
- Never use production credentials in development
- Use environment-specific database URLs

## 🌍 Environment-Specific Setup

### Development
```env
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api
```

### Staging
```env
NODE_ENV=staging
VITE_API_URL=https://staging-api.flicklifestyle.com/api
```

### Production
```env
NODE_ENV=production
VITE_API_URL=https://api.flicklifestyle.com/api
```

## 🔧 Manual Setup Steps

If you prefer to set up manually:

1. **Backend Setup:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your actual credentials
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   cp env.example .env
   # Edit .env with your API URLs
   ```

3. **Admin Setup:**
   ```bash
   cd admin
   cp env.example .env
   # Edit .env with your API URLs
   ```

## 🚨 Important Notes

1. **API URL Consistency:** Make sure all frontend and admin applications use the same API URL
2. **CORS Configuration:** Update backend CORS settings to match your frontend URLs
3. **Database Security:** Use strong passwords and enable authentication for MongoDB
4. **Cloudinary Setup:** Create a Cloudinary account and get your credentials
5. **Email Setup:** Use app passwords for Gmail (not regular passwords)

## 🔍 Troubleshooting

### Common Issues:

1. **Environment variables not loading:**
   - Make sure `.env` files are in the correct directories
   - Restart your development servers after creating `.env` files
   - Check file permissions

2. **API connection errors:**
   - Verify API URLs in frontend/admin `.env` files
   - Check if backend server is running
   - Ensure CORS is properly configured

3. **Database connection issues:**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure database credentials are correct

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, Cloudinary, etc.) are properly configured
4. Check the main README.md for additional setup instructions
