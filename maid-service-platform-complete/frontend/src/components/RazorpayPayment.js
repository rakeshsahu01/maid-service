import React, { useState } from 'react';
import axios from 'axios';

const RazorpayPayment = ({ amount, bookingData, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const pay = async () => {
    setLoading(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) {
        return onFailure?.('Razorpay SDK failed to load');
      }

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/payments/create-order`, {
        amount,
        currency: 'INR',
        notes: { service: bookingData?.serviceName || '' }
      });

      if (!data?.success) throw new Error('Order creation failed');

      const { orderId, key } = data.data;

      const options = {
        key,
        amount: amount * 100,
        currency: 'INR',
        name: 'CleanConnect',
        description: 'Maid Service Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            const verify = await axios.post(`${process.env.REACT_APP_API_URL}/payments/verify`, response);
            if (verify.data?.success) onSuccess?.(verify.data.data);
            else onFailure?.('Verification failed');
          } catch (_) {
            onFailure?.('Verification error');
          }
        },
        prefill: {
          name: bookingData?.customerName || '',
          email: bookingData?.customerEmail || '',
          contact: bookingData?.customerPhone || ''
        },
        theme: { color: '#3B82F6' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      onFailure?.(e.message || 'Payment failed to start');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn-primary w-full py-3" onClick={pay} disabled={loading}>
      {loading ? 'Processing…' : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayPayment;
