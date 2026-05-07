# CleanConnect - Deployment Guide

## Free Deployment Stack
- **Frontend**: Vercel
- **Backend**: Render  
- **Database**: MongoDB Atlas

---

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with your email or Google account
4. Create a free cluster (M0 tier - free forever)
5. Choose region closest to your users

### 1.2 Create Database User
1. Go to **Database Access** → **Add New User**
2. Set username: `maidserviceuser`
3. Set password: `GenerateSecurePassword123!` (save this!)
4. Grant roles: **Read and write to any database**
5. Click **Add User**

### 1.3 Whitelist IP Address
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow access from anywhere** (0.0.0.0/0) for free tier testing
   - ⚠️ For production, whitelist specific Render IP

### 1.4 Get Connection String
1. Go to **Databases** → Click **Connect** button
2. Select **Drivers** → **Node.js**
3. Copy the connection string
4. Replace `<password>` and `<username>` with your credentials
5. Example: `mongodb+srv://maidserviceuser:password@cluster0.xxxxx.mongodb.net/maid-service?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Render

### 2.1 Prepare Backend Files
The backend is ready! Files needed:
- ✅ `server.js`
- ✅ `package.json`
- ✅ `.env` (will set via Render dashboard)

### 2.2 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub or email
3. Verify email

### 2.3 Deploy Backend Service
1. Click **New** → **Web Service**
2. Select **Build and deploy from a Git repository**
3. If asked, install Render GitHub app and authorize your repository
4. Select your repository
5. Configure:
   - **Name**: `maid-service-backend`
   - **Root Directory**: `backend` (or path to your backend folder)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.4 Set Environment Variables on Render
1. Scroll to **Environment** section
2. Add these variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://maidserviceuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/maid-service?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   CLIENT_URL=https://your-frontend.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```

3. Click **Deploy**
4. Wait 5-10 minutes for deployment
5. Once deployed, copy your backend URL (e.g., `https://maid-service-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend
1. Create `.env.production` in frontend folder:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key
   REACT_APP_APP_NAME=CleanConnect
   ```

### 3.2 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### 3.3 Deploy Frontend
1. Click **Add New...** → **Project**
2. Select your GitHub repository
3. Click **Import**
4. Configure:
   - **Framework Preset**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.4 Set Environment Variables
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key
   REACT_APP_APP_NAME=CleanConnect
   ```
3. Click **Save**
4. Redeploy: Click **Deployments** → **...** → **Redeploy**

### 3.5 Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your domain and follow DNS instructions

---

## Step 4: Update Backend Server Configuration

Add this CORS configuration to `server.js`:

```javascript
const allowedOrigins = [
  'https://your-frontend.vercel.app',
  'http://localhost:3000' // for local development
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## Step 5: Test Your Deployment

### 5.1 Test Backend
```
curl https://your-backend.onrender.com/health
```
Should return: `{"status":"OK","message":"Maid Service API is running"}`

### 5.2 Test Frontend
1. Visit `https://your-frontend.vercel.app`
2. Try registering a new account
3. Try logging in
4. Check if requests go to your backend

---

## Troubleshooting

### Backend not starting?
1. Check Render logs: **Dashboard** → **Your Service** → **Logs**
2. Ensure `MONGODB_URI` is correct
3. Check `JWT_SECRET` is set

### Frontend can't reach backend?
1. Check CORS error in browser console
2. Update `REACT_APP_API_URL` in Vercel environment variables
3. Redeploy frontend after updating env vars

### Database connection failing?
1. Verify MongoDB Atlas whitelist includes Render IPs
2. Check connection string has correct password
3. Ensure database name is correct

### 500 errors on API calls?
1. Check backend logs in Render
2. Verify all environment variables are set
3. Check database connection

---

## Free Tier Limitations

- **MongoDB Atlas**: 512MB storage (plenty for testing)
- **Render**: Auto-spins down after 15 min of inactivity (cold start delay on first request)
- **Vercel**: Limited build minutes per month
- **Razorpay**: Test mode (use test credentials)

---

## Next Steps (After Free Tier)

When you're ready for production:
- Upgrade MongoDB Atlas to M5 ($57/month)
- Upgrade Render to paid tier for always-on service
- Switch Razorpay to production mode
- Set up custom domain
- Configure SSL/TLS certificates

---

## Support Links

- MongoDB Atlas: https://docs.mongodb.com/atlas/
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Razorpay: https://razorpay.com/docs/

