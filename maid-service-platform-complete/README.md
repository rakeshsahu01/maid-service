# CleanConnect - Maid Service Platform

## 🚀 Full-Stack Maid Service Marketplace

A comprehensive platform connecting customers with professional cleaning service providers.

### Features
- 🔐 JWT Authentication & Authorization
- 👥 Dual Role System (Customer & Maid)
- 💳 Stripe Payment Integration
- 📱 Responsive Dashboard Design
- 📅 Service Booking & Management
- ⭐ Rating & Review System
- 📊 Analytics & Reporting

### Tech Stack
- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB
- **Payment**: Stripe API
- **Authentication**: JWT
- **Database**: MongoDB with Mongoose

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe Account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd maid-service-platform
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/maid-service
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_your_key
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### Test Accounts
- **Customer**: customer@example.com / password123
- **Maid**: maid@example.com / password123

## Deployment

### Heroku Deployment
```bash
# Backend
heroku create your-app-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main

# Frontend (Vercel)
vercel --prod
```

## License

MIT License - see LICENSE file for details.