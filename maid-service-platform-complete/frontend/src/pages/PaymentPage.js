import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RazorpayPayment from '../components/RazorpayPayment';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingData = state?.bookingData;
  const { token } = useAuth();

  const createBooking = async (payload) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Create booking assigned to maid
      await createBooking({
        service: bookingData.serviceName,
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
        amount: bookingData.amount,
        specialInstructions: bookingData.specialInstructions || '',
        maidId: bookingData.maidId // IMPORTANT
      });

      // Navigate to bookings or show success; maid can now see it as pending
      navigate('/customer/bookings', {
        state: {
          message: 'Booking confirmed and payment completed!',
          paymentData
        }
      });
    } catch (e) {
      alert(e?.response?.data?.message || 'Booking creation failed after payment');
    }
  };

  const handlePaymentFailure = (msg) => {
    alert(`Payment failed: ${msg}`);
  };

  if (!bookingData) {
    return <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 rounded">No booking data found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* ... order summary UI ... */}
      <div className="bg-white rounded-lg shadow p-6">
        <RazorpayPayment
          amount={bookingData.amount}
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
