import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import MaidDashboard from './pages/MaidDashboard';
import ServiceBooking from './pages/ServiceBooking';
import PaymentPage from './pages/PaymentPage';
import BookingHistory from './pages/BookingHistory';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/customer/book-service" element={
                <ProtectedRoute role="customer">
                  <ServiceBooking />
                </ProtectedRoute>
              } />
              <Route path="/customer/payment" element={
                <ProtectedRoute role="customer">
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/customer/bookings" element={
                <ProtectedRoute role="customer">
                  <BookingHistory />
                </ProtectedRoute>
              } />

              {/* Maid Routes */}
              <Route path="/maid/dashboard" element={
                <ProtectedRoute role="maid">
                  <MaidDashboard />
                </ProtectedRoute>
              } />

              {/* Shared Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;