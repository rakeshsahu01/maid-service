import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data?.data || { total: 0, completed: 0, pending: 0, totalSpent: 0 });
      setErr('');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const cards = [
    { label: 'Total Bookings', value: stats.total, icon: '📅' },
    { label: 'Completed', value: stats.completed, icon: '✅' },
    { label: 'Pending', value: stats.pending, icon: '⏳' },
    { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString()}`, icon: '💰' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Manage your bookings and profile</p>
        </div>
        <button className="btn-outline" onClick={loadStats}>Refresh</button>
      </div>

      {err && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{err}</div>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((s, i) => (
          <div key={i} className="dashboard-stat">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{s.label}</p>
                <p className="text-3xl font-bold">{loading ? '…' : s.value}</p>
              </div>
              <div className="text-3xl">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/customer/book-service" className="btn-primary text-center">📅 Book Service</Link>
          <Link to="/customer/bookings" className="btn-outline text-center">📋 View Bookings</Link>
          <Link to="/profile" className="btn-outline text-center">👤 Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
