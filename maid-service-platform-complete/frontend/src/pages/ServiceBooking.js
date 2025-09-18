import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ServiceBooking = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    serviceId: '1',
    address: '',
    date: '',
    time: '',
    specialInstructions: '',
    maidId: '' // selected maid
  });

  const [maids, setMaids] = useState([]);
  const [loadingMaids, setLoadingMaids] = useState(true);
  const [error, setError] = useState('');

  const services = [
    { id: '1', name: 'House Cleaning', price: 800 },
    { id: '2', name: 'Deep Cleaning', price: 1500 },
    { id: '3', name: 'Office Cleaning', price: 1200 },
    { id: '4', name: 'Move-in/Move-out', price: 2000 }
  ];

  useEffect(() => {
    const loadMaids = async () => {
      try {
        // Optional: you can expose GET /api/users/maids to list available maids
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/maids`);
        const list = data?.data?.maids || [];
        setMaids(list);
        // Preselect first maid if list is not empty
        if (list.length > 0) {
          setForm(prev => ({ ...prev, maidId: list[0].id || list[0]._id || list[0].email || '' }));
        }
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load maids');
      } finally {
        setLoadingMaids(false);
      }
    };
    loadMaids();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    const svc = services.find(s => s.id === form.serviceId);
    if (!svc) {
      setError('Invalid service');
      return;
    }
    if (!form.maidId) {
      setError('Please select a maid');
      return;
    }

    navigate('/customer/payment', {
      state: {
        bookingData: {
          serviceId: svc.id,
          serviceName: svc.name,
          amount: svc.price,
          date: form.date,
          time: form.time,
          address: form.address,
          specialInstructions: form.specialInstructions,
          maidId: form.maidId // IMPORTANT: pass maidId forward
        }
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Book a Service</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Service</label>
          <select name="serviceId" className="input-field" value={form.serviceId} onChange={onChange}>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Assign Maid</label>
          {loadingMaids ? (
            <div className="text-gray-500">Loading maids…</div>
          ) : maids.length === 0 ? (
            <div className="text-gray-500">No maids available.</div>
          ) : (
            <select
              name="maidId"
              className="input-field"
              value={form.maidId}
              onChange={onChange}
              required
            >
              {maids.map(m => {
                const id = m.id || m._id || m.email; // choose a stable identifier
                const label = `${m.name || m.email} ${m.profile?.rating?.average ? `(${m.profile.rating.average}⭐)` : ''}`;
                return <option key={id} value={id}>{label}</option>;
              })}
            </select>
          )}
        </div>

        <input
          className="input-field"
          name="address"
          placeholder="Service address"
          value={form.address}
          onChange={onChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input className="input-field" type="date" name="date" value={form.date} onChange={onChange} required />
          <input className="input-field" type="time" name="time" value={form.time} onChange={onChange} required />
        </div>

        <textarea
          className="input-field"
          rows="3"
          name="specialInstructions"
          placeholder="Special instructions"
          value={form.specialInstructions}
          onChange={onChange}
        />

        <button className="btn-primary w-full py-3">Continue to Payment</button>
      </form>
    </div>
  );
};

export default ServiceBooking;
