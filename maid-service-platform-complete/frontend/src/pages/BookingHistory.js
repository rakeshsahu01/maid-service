import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BookingHistory = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(data?.data?.bookings || []);
      setErr('');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const statusClass = useMemo(() => ({
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    pending: 'bg-gray-100 text-gray-800',
    declined: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800'
  }), []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Bookings</h1>
        <button className="btn-outline" onClick={load}>Refresh</button>
      </div>

      {err && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{err}</div>}
      {loading && <p className="text-gray-500">Loading…</p>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-6 py-4">{b.service || 'Cleaning Service'}</td>
                <td className="px-6 py-4">{b.date}</td>
                <td className="px-6 py-4">{b.time}</td>
                <td className="px-6 py-4">{b.address}</td>
                <td className="px-6 py-4">₹{b.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass[b.status] || 'bg-gray-100 text-gray-800'}`}>
                    {String(b.status || '').replace('_',' ')}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && !loading && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={6}>No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistory;
