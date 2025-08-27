# Flick Lifestyle - Deployment Guide

This guide provides step-by-step instructions for deploying the Flick Lifestyle e-commerce application to production.

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or self-hosted MongoDB)
- Cloudinary account for image storage
- Stripe account for payments
- Email service (Gmail, SendGrid, etc.)
- Domain name and SSL certificate
- Hosting platform (Vercel, Netlify, Railway, Heroku, etc.)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Frontend and Admin URLs (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=20971520
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api
VITE_API_BASE_URL=https://your-backend-domain.com/api

# App Configuration
VITE_APP_NAME=Flick Lifestyle
VITE_APP_VERSION=1.0.0

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
```

### Admin Environment Variables

Create a `.env` file in the `admin/` directory:

```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api
VITE_API_BASE_URL=https://your-backend-domain.com/api

# App Configuration
VITE_APP_NAME=Flick Lifestyle Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend/Admin)

#### Frontend Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables in Vercel dashboard
5. Deploy

#### Admin Deployment
1. Create a separate Vercel project for admin
2. Set root directory to `admin/`
3. Use same build settings as frontend
4. Add environment variables
5. Deploy

### Option 2: Railway (Recommended for Backend)

1. Push your code to GitHub
2. Connect your repository to Railway
3. Set the root directory to `backend/`
4. Add environment variables in Railway dashboard
5. Deploy

### Option 3: Heroku

#### Backend Deployment
1. Create a new Heroku app
2. Connect your GitHub repository
3. Set buildpacks:
   - `heroku/nodejs`
4. Add environment variables
5. Deploy

#### Frontend/Admin Deployment
1. Use Heroku static buildpack
2. Set build command: `npm run build`
3. Set static directory: `dist`

## Database Setup

### MongoDB Atlas
1. Create a new cluster
2. Create a database user
3. Get your connection string
4. Add to environment variables

### Initial Data Setup
After deployment, you'll need to:
1. Create admin users
2. Add categories
3. Add products
4. Configure payment settings

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong passwords for database
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use environment variables for all secrets
- [ ] Enable helmet security headers
- [ ] Set up proper error handling
- [ ] Configure logging
- [ ] Set up monitoring

## Performance Optimization

### Backend
- [ ] Enable compression
- [ ] Set up caching
- [ ] Optimize database queries
- [ ] Use CDN for static files
- [ ] Enable gzip compression

### Frontend
- [ ] Optimize images
- [ ] Enable code splitting
- [ ] Use lazy loading
- [ ] Minimize bundle size
- [ ] Enable caching

## Monitoring and Logging

### Recommended Tools
- **Application Monitoring**: Sentry, LogRocket
- **Performance Monitoring**: New Relic, DataDog
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Bugsnag

### Logging Setup
```javascript
// Add to backend/server.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## SSL/HTTPS Setup

### Automatic (Recommended)
- Use hosting platform's built-in SSL
- Vercel, Netlify, Railway provide automatic SSL

### Manual Setup
1. Obtain SSL certificate (Let's Encrypt)
2. Configure your web server (Nginx, Apache)
3. Set up redirects from HTTP to HTTPS

## Domain Configuration

1. Point your domain to your hosting provider
2. Set up DNS records
3. Configure subdomains if needed
4. Set up email forwarding

## Backup Strategy

### Database Backups
- Set up automated MongoDB backups
- Store backups in multiple locations
- Test restore procedures regularly

### Code Backups
- Use Git for version control
- Set up automated deployments
- Keep deployment logs

## Post-Deployment Checklist

- [ ] Test all functionality
- [ ] Verify payment processing
- [ ] Check email notifications
- [ ] Test admin panel
- [ ] Verify image uploads
- [ ] Check mobile responsiveness
- [ ] Test performance
- [ ] Verify security headers
- [ ] Set up monitoring
- [ ] Create backup procedures

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check environment variables
   - Verify frontend URLs in backend CORS config

2. **Database Connection Issues**
   - Verify MongoDB URI
   - Check network access
   - Verify credentials

3. **Image Upload Issues**
   - Check Cloudinary credentials
   - Verify file size limits
   - Check upload permissions

4. **Payment Issues**
   - Verify Stripe keys
   - Check webhook configuration
   - Test with Stripe test mode first

### Support

For deployment issues:
1. Check hosting platform documentation
2. Review error logs
3. Test locally first
4. Contact hosting support if needed

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor performance metrics
- Review security updates
- Backup database regularly
- Check error logs
- Update SSL certificates

### Scaling Considerations
- Use CDN for static assets
- Implement caching strategies
- Consider database sharding
- Use load balancers if needed
- Monitor resource usage
