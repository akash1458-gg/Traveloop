import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import db from '../utils/database';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem('traveloop_current_user');
    if (savedUserId) {
      const u = db.getById('users', savedUserId);
      if (u) setUser(u);
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    const users = db.getAll('users');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    setUser(found);
    localStorage.setItem('traveloop_current_user', found.id);
    return { success: true };
  }, []);

  const signup = useCallback((name, email, password) => {
    const users = db.getAll('users');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = db.insert('users', { name, email, password, avatar: '', preferences: { language: 'en', currency: 'USD' } });
    setUser(newUser);
    localStorage.setItem('traveloop_current_user', newUser.id);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('traveloop_current_user');
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user) return;
    const updated = db.update('users', user.id, updates);
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
