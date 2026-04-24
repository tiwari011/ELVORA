
import { createContext, useContext, useState } from 'react';
import { api } from '../utils/api';

const AdminContext = createContext();

// Helper to get valid admin state from localStorage
const getInitialAdmin = () => {
  try {
    const storedAdmin = JSON.parse(localStorage.getItem('admin') || 'null');
    const storedToken = localStorage.getItem('adminToken');
    const role = storedAdmin?.role?.toLowerCase?.();

    if (storedToken && storedAdmin && role === 'admin') {
      return { admin: storedAdmin, token: storedToken };
    }
  } catch {
    // ignore parse errors
  }
  // Clear invalid session
  localStorage.removeItem('admin');
  localStorage.removeItem('adminToken');
  return { admin: null, token: null };
};

export const AdminProvider = ({ children }) => {
  const initial = getInitialAdmin();
  const [admin, setAdmin] = useState(initial.admin);
  const [adminToken, setAdminToken] = useState(initial.token);

 const adminLogin = async (email, password) => {
  try {
    const data = await api('/admin/login', {
      method: 'POST',
      body: { email, password }, // ✅ FIXED
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('🔍 FULL BACKEND RESPONSE:', data);

    let adminData = null;
    let token = null;

    // ✅ Handle all possible formats safely
    if (data?.admin && data?.token) {
      adminData = data.admin;
      token = data.token;
    } else if (data?.data?.admin) {
      adminData = data.data.admin;
      token = data.data.token;
    } else {
      adminData = data;
      token = data?.token;
    }

    console.log('👤 FINAL ADMIN DATA:', adminData);
    console.log('🔑 FINAL TOKEN:', token);

    // ❌ Safety checks
    if (!adminData) {
      throw new Error('Admin data not found in response');
    }

    if (!token) {
      throw new Error('Token not found in response');
    }

    // ✅ FIXED ROLE CHECK (main bug fix)
    const role = (adminData?.role || 'admin').toLowerCase();

    console.log('🎭 ADMIN ROLE:', role);

    if (role !== 'admin') {
      throw new Error(`Unauthorized - Not an admin (role: ${role})`);
    }

    // ✅ Save state
    setAdmin(adminData);
    setAdminToken(token);

    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminToken', token);

    console.log('✅ ADMIN LOGIN SUCCESSFUL');

    return { success: true };

  } catch (error) {
    console.error('❌ ADMIN LOGIN ERROR:', error);
    throw error;
  }
};
  const adminLogout = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    console.log('👋 ADMIN LOGGED OUT');
  };

  const isAdminAuthenticated = !!adminToken && admin?.role?.toLowerCase?.() === 'admin';

  return (
    <AdminContext.Provider 
      value={{ 
        admin, 
        adminToken, 
        adminLogin, 
        adminLogout, 
        isAdminAuthenticated 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};