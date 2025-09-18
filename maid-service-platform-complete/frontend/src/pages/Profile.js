import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const onSave = async () => {
    setBusy(true);
    setMsg('');
    try {
      await updateProfile({ name, phone });
      setMsg('Profile updated');
    } catch (e) {
      setMsg('Update failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {msg && <div className="mb-3 bg-blue-50 text-blue-800 p-3 rounded">{msg}</div>}
      <div className="space-y-4">
        <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
        <button className="btn-primary w-full py-3" onClick={onSave} disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
      </div>
    </div>
  );
};

export default Profile;
