import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // { id, name, email, role }
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const load = async () => {
      try {
        if (token) {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`);
          setUser(res.data.data.user);
        }
      } catch (_) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
    return { success: true, user: u };
  };

  const register = async (payload) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, payload);
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
    return { success: true, user: u };
  };

  const updateProfile = async (profile) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/auth/profile`, profile);
    setUser(res.data.data.user);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
