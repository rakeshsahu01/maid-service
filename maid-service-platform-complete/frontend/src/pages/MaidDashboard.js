import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MaidDashboard = () => {
  const { user, token } = useAuth();

  // Lists
  const [pending, setPending] = useState([]);
  const [active, setActive] = useState([]);     // confirmed + in_progress
  const [completed, setCompleted] = useState([]);

  // Summary
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0 });

  // UI state
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const loadStats = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(data?.data || { total: 0, completed: 0, pending: 0 });
    } catch (_) { /* silent */ }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = data?.data?.bookings || [];

      const p = list.filter(b => b.status === 'pending');
      const a = list.filter(b => b.status === 'confirmed' || b.status === 'in_progress');
      const c = list.filter(b => b.status === 'completed');

      setPending(p);
      setActive(a);
      setCompleted(c);
      setErr('');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([loadBookings(), loadStats()]);
  };

  useEffect(() => {
    if (token) refreshAll();
    // Optional polling (15s):
    // const id = setInterval(() => { if (token) refreshAll(); }, 15000);
    // return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshAll();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update status');
    }
  };

  const accept = (id) => updateStatus(id, 'confirmed');
  const decline = (id) => updateStatus(id, 'declined');
  const startJob = (id) => updateStatus(id, 'in_progress');
  const completeJob = (id) => updateStatus(id, 'completed');

  const cards = useMemo(() => ([
    { label: 'Pending Requests', value: String(summary.pending), icon: '📋' },
    { label: 'Completed Jobs', value: String(summary.completed), icon: '✅' },
    { label: 'This Month', value: '₹0', icon: '💰' }, // TODO: compute earnings if needed
    { label: 'Rating', value: user?.profile?.rating?.average?.toFixed?.(1) || '4.8', icon: '⭐' }
  ]), [summary, user?.profile?.rating?.average]);

  const BookingCard = ({ item, actions }) => (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.service || 'Cleaning Service'}</h3>
          {item.customerName && <p className="text-gray-600">Customer: {item.customerName}</p>}
          <p className="text-gray-600">📅 {item.date} at {item.time}</p>
          <p className="text-gray-600">📍 {item.address}</p>
          {typeof item.amount !== 'undefined' && (
            <p className="text-green-600 font-semibold">₹{item.amount}</p>
          )}
          <p className="mt-1 text-sm">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.status === 'completed' ? 'bg-green-100 text-green-800' :
              item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
              item.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
              item.status === 'pending' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {item.status.replace('_',' ')}
            </span>
          </p>
        </div>
        {actions && <div className="flex gap-2 ml-4">{actions}</div>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Manage requests and schedule</p>
        </div>
        <button className="btn-outline" onClick={refreshAll}>Refresh</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((s, i) => (
          <div key={i} className="dashboard-stat">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{s.label}</p>
                <p className="text-3xl font-bold">{s.value}</p>
              </div>
              <div className="text-3xl">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {err && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{err}</div>}
      {loading && <p className="text-gray-500">Loading…</p>}

      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Pending Requests</h2>
        </div>
        <div className="p-6">
          {pending.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
          ) : (
            <div className="space-y-4">
              {pending.map(b => (
                <BookingCard
                  key={b.id}
                  item={b}
                  actions={
                    <>
                      <button className="btn-secondary" onClick={() => accept(b.id)}>Accept</button>
                      <button
                        className="btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => decline(b.id)}
                      >
                        Decline
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Jobs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Active Jobs</h2>
        </div>
        <div className="p-6">
          {active.length === 0 ? (
            <p className="text-gray-500">No active jobs.</p>
          ) : (
            <div className="space-y-4">
              {active.map(b => (
                <BookingCard
                  key={b.id}
                  item={b}
                  actions={
                    <>
                      {b.status === 'confirmed' && (
                        <button className="btn-secondary" onClick={() => startJob(b.id)}>Start</button>
                      )}
                      {b.status !== 'completed' && (
                        <button className="btn-primary" onClick={() => completeJob(b.id)}>Complete</button>
                      )}
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Completed</h2>
        </div>
        <div className="p-6">
          {completed.length === 0 ? (
            <p className="text-gray-500">No completed jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {completed.map(b => (
                <BookingCard key={b.id} item={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaidDashboard;
