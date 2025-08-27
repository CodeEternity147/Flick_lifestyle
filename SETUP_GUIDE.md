# 🚀 Flick Lifestyle - Setup Guide

## Quick Start Guide

### 1. Environment Setup

#### Backend Environment (Already Created)
The `backend/config.env` file has been created with default values. You'll need to update these with your actual credentials:

```env
# Update these values in backend/config.env:

# MongoDB - Use MongoDB Atlas or local MongoDB
MONGODB_URI=mongodb://localhost:27017/flick_lifestyle

# JWT - Generate a secure secret key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary - Sign up at cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe - Sign up at stripe.com
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email - Use Gmail or any SMTP provider
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

#### Frontend Environment
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Flick Lifestyle
VITE_APP_VERSION=1.0.0
```

#### Admin Panel Environment
Create `admin/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Flick Lifestyle Admin
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies

Open three terminal windows and run these commands:

#### Terminal 1 - Backend
```bash
cd backend
npm install
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm install
```

#### Terminal 3 - Admin Panel
```bash
cd admin
npm install
```

### 3. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

#### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

#### Start Admin Panel
```bash
cd admin
npm run dev
```
Admin panel will run on: http://localhost:3001

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `backend/config.env`

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The default URI `mongodb://localhost:27017/flick_lifestyle` will work

### 5. External Services Setup

#### Cloudinary (Image Uploads)
1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your cloud name, API key, and API secret
4. Update the Cloudinary variables in `backend/config.env`

#### Stripe (Payments)
1. Go to [Stripe](https://stripe.com)
2. Create an account
3. Get your secret key from the dashboard
4. Update the Stripe variables in `backend/config.env`

#### Email (Optional)
1. Use Gmail or any SMTP provider
2. For Gmail, enable 2-factor authentication and generate an app password
3. Update the email variables in `backend/config.env`

### 6. Test the Application

#### Frontend (User Interface)
- Visit: http://localhost:3000
- Register a new user account
- Browse products, add to cart, and test the checkout process

#### Admin Panel
- Visit: http://localhost:3001
- Login with admin credentials (you'll need to create an admin user first)
- Test the dashboard and management features

### 7. Create Admin User

To create an admin user, you can either:

#### Option A: Use the API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

#### Option B: Modify the User Model
Temporarily modify the User model to allow admin role creation, then register normally.

### 8. Troubleshooting

#### Common Issues:

1. **Port Already in Use**
   - Change the port in the respective `.env` files
   - Or kill the process using the port

2. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify the connection string
   - Check network connectivity

3. **CORS Errors**
   - Ensure the frontend and admin URLs are correct in `backend/config.env`
   - Check that the backend is running on the correct port

4. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits

5. **Payment Issues**
   - Use Stripe test keys for development
   - Check webhook configuration

### 9. Development Tips

#### Backend Development
- Use `npm run dev` for development with auto-restart
- Check the console for detailed error messages
- Use Postman or similar tools to test API endpoints

#### Frontend Development
- Use React Developer Tools for debugging
- Check the browser console for errors
- Use Redux DevTools for state management debugging

#### Admin Panel Development
- Similar to frontend development
- Test admin-specific features thoroughly

### 10. Production Deployment

When ready for production:

1. **Backend**
   - Set `NODE_ENV=production`
   - Use environment variables from your hosting platform
   - Set up proper MongoDB Atlas cluster
   - Configure production Stripe keys

2. **Frontend & Admin**
   - Run `npm run build`
   - Deploy the `dist` folder to your hosting platform
   - Update API URLs to production backend

### 11. Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong passwords
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS configuration
- [ ] Use environment variables for all secrets
- [ ] Set up rate limiting
- [ ] Configure proper file upload limits

---

## 🎉 You're Ready!

Your MERN stack e-commerce application is now set up and ready for development. The application includes:

- ✅ Complete backend API with authentication
- ✅ User-facing frontend with modern UI
- ✅ Admin panel for management
- ✅ Product management system
- ✅ Order processing
- ✅ Payment integration
- ✅ File upload capabilities
- ✅ Responsive design

Happy coding! 🚀
