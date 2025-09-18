// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 1) Create the app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// 2) Import error handlers (named exports)
const { errorHandler, notFound } = require('./middleware/errorHandler');

// 3) Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// 4) Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// 5) Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 6) Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maid-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// 7) Import routes AFTER app is created
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');

// Optional: payments (mock or real). If you don’t have keys, keep mocked file or comment out.
const paymentRoutes = require('./routes/payments');

// 8) Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// 9) Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Maid Service API is running',
    timestamp: new Date().toISOString()
  });
});

// 10) Error handling (AFTER routes)
app.use(notFound);
app.use(errorHandler);

// 11) Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
