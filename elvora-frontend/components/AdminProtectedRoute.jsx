

import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminProtectedRoute({ children }) {
  const { admin, adminToken } = useAdmin();

  console.log("🔐 AUTH CHECK:", adminToken, admin);

  // ❌ REMOVE the null check completely

  const isAdmin =
    !!adminToken && admin?.role?.toLowerCase?.() === 'admin';

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
}