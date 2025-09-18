import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: 'customer', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setBusy(true);
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone, role: form.role, password: form.password };
      const res = await register(payload);
      const dest = res.user.role === 'customer' ? '/customer/dashboard' : '/maid/dashboard';
      navigate(dest);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Create your account</h1>
      {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Account type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="customer" checked={form.role==='customer'} onChange={onChange} />
              <span>Customer</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="maid" checked={form.role==='maid'} onChange={onChange} />
              <span>Maid</span>
            </label>
          </div>
        </div>
        <input className="input-field" placeholder="Full name" name="name" value={form.name} onChange={onChange} required />
        <input className="input-field" placeholder="Email" type="email" name="email" value={form.email} onChange={onChange} required />
        <input className="input-field" placeholder="Phone" name="phone" value={form.phone} onChange={onChange} required />
        <input className="input-field" placeholder="Password" type="password" name="password" value={form.password} onChange={onChange} required />
        <input className="input-field" placeholder="Confirm password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} required />
        <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button>
      </form>
      <p className="text-sm text-gray-500 mt-3">
        Already have an account? <Link className="text-blue-600" to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
