# Deployment Guide

## Local Development

1. **Setup Dependencies**
```bash
./setup.sh
# or manually:
cd backend && npm install
cd ../frontend && npm install
```

2. **Environment Configuration**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit with your MongoDB URI, JWT secret, etc.

# Frontend  
cp frontend/.env.example frontend/.env
# Edit with your API URL
```

3. **Start Development**
```bash
npm run dev  # Starts both frontend and backend
```

## Production Deployment

### Using Docker
```bash
docker-compose up -d
```

### Manual Deployment

#### Backend (Heroku/Railway)
```bash
cd backend
heroku create your-app-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git init && git add . && git commit -m "Initial commit"
git push heroku main
```

#### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build folder to Vercel/Netlify
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maid-service
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_live_your_stripe_key
CLIENT_URL=https://your-frontend-domain.com
```

**Frontend (.env)**
```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

## Database Setup

1. **MongoDB Atlas**
   - Create account at mongodb.com
   - Create new cluster
   - Get connection string
   - Add to MONGODB_URI

2. **Local MongoDB**
   - Install MongoDB locally
   - Use: mongodb://localhost:27017/maid-service

## Payment Setup

1. **Stripe Account**
   - Create account at stripe.com
   - Get API keys from dashboard
   - Add to environment variables
   - Set up webhooks for payment events

## Email Service

1. **Gmail Setup**
   - Enable 2FA on Gmail account
   - Generate app password
   - Use in SMTP_PASS environment variable

2. **SendGrid**
   - Create SendGrid account
   - Get API key
   - Configure in environment variables
