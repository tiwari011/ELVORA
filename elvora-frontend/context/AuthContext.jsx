import { createContext, useContext, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    setUser(data.user); setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return data;
  };
  
  const register = async (userData) => {
    const data = await api('/auth/register', { method: 'POST', body: userData });
    setUser(data.user); setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return data;
  };
  
  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  const updateProfile = async (data) => {
    const updated = await api('/auth/profile', { method: 'PUT', body: data });
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);