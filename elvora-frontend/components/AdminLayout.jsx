import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminLayout() {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-dark text-white p-4">
        <h2 className="text-2xl font-bold text-secondary mb-6">ELVORA Admin</h2>
        <nav className="space-y-2">
          <Link to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link to="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-700">Products</Link>
          <Link to="/admin/categories" className="block px-3 py-2 rounded hover:bg-gray-700">Categories</Link>
          <Link to="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-700">Orders</Link>
          <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-700">Users</Link>
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded hover:bg-red-700 mt-8">Logout</button>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="mb-4 text-sm text-gray-600">Welcome, {admin?.username}</div>
        <Outlet />
      </main>
    </div>
  );
}