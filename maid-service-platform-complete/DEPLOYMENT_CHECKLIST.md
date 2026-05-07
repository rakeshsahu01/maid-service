# Deployment Checklist

## Pre-Deployment ✓
- [x] Project structure is correct
- [x] Environment templates created
- [x] Backend CORS configured for production
- [x] .gitignore created

## Database Setup (MongoDB Atlas)
- [ ] Create MongoDB Atlas account (https://mongodb.com/cloud/atlas)
- [ ] Create free M0 cluster
- [ ] Create database user (save credentials!)
- [ ] Whitelist Render IP (0.0.0.0/0 for now)
- [ ] Copy connection string and save it securely
- [ ] Test connection string format:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/maid-service?retryWrites=true&w=majority
  ```

## Backend Deployment (Render)
- [ ] Create Render account (https://render.com)
- [ ] Push code to GitHub repository
- [ ] Create new Web Service on Render
- [ ] Select your GitHub repository
- [ ] Configure:
  - [ ] Name: `maid-service-backend`
  - [ ] Root Directory: `backend`
  - [ ] Environment: Node
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Add Environment Variables:
  - [ ] `PORT=5000`
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=` (from MongoDB Atlas)
  - [ ] `JWT_SECRET=` (generate secure random string)
  - [ ] `CLIENT_URL=` (will update after frontend deployed)
  - [ ] Razorpay keys (if available)
- [ ] Deploy and wait for success (5-10 minutes)
- [ ] **SAVE YOUR BACKEND URL** (e.g., https://maid-service-backend.onrender.com)
- [ ] Test health endpoint: `https://your-backend.onrender.com/health`

## Frontend Deployment (Vercel)
- [ ] Create Vercel account (https://vercel.com)
- [ ] Connect GitHub repository
- [ ] Add new project
- [ ] Configure:
  - [ ] Framework: React
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Add Environment Variables:
  - [ ] `REACT_APP_API_URL=` (use your Render backend URL + `/api`)
  - [ ] `REACT_APP_RAZORPAY_KEY_ID=` (get from Razorpay)
  - [ ] `REACT_APP_APP_NAME=CleanConnect`
- [ ] Redeploy after setting variables
- [ ] **SAVE YOUR FRONTEND URL** (e.g., https://your-app.vercel.app)

## Post-Deployment
- [ ] Update Backend's `CLIENT_URL` environment variable with frontend URL
- [ ] Verify CORS is working (check browser console for CORS errors)
- [ ] Test application workflow:
  - [ ] Visit frontend URL
  - [ ] Try registration
  - [ ] Try login
  - [ ] Check that requests reach backend (check Network tab)
- [ ] If using Razorpay, update webhook URLs in Razorpay dashboard

## Performance Optimization
- [ ] Render free tier auto-sleeps - first request may be slow
- [ ] Monitor application logs for errors
- [ ] Set up error tracking (optional)

## Custom Domain (Optional)
- [ ] Buy domain from registrar (Namecheap, GoDaddy, etc.)
- [ ] Connect to Vercel frontend
- [ ] Update backend `CLIENT_URL` if domain changes

## Monitoring
- [ ] Enable error logging/monitoring
- [ ] Set up uptime monitoring (optional)
- [ ] Monitor database storage (free tier has 512MB limit)

---

## Credentials to Save Securely

```
MongoDB Atlas:
- Connection String: ___________________
- Username: ___________________
- Password: ___________________

Render:
- Backend URL: ___________________
- Dashboard: https://dashboard.render.com

Vercel:
- Frontend URL: ___________________
- Dashboard: https://vercel.com/dashboard

Razorpay (if applicable):
- Test Key ID: ___________________
- Test Key Secret: ___________________
```

## Troubleshooting Commands

```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Check backend logs
# Go to: https://dashboard.render.com → Select service → Logs

# Check frontend build logs
# Go to: https://vercel.com/dashboard → Select project → Deployments

# Test MongoDB connection
# Use MongoDB Compass or Atlas UI
```

