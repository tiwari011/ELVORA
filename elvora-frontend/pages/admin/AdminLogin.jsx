import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';



export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();

  const [form, setForm] = useState({ email: '', password: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(form.email, form.password);
      toast.success('"🚀 Welcome Admin');
    navigate('/admin/dashboard', { replace: true },100);
    } catch (err) { toast.error(err.message); }
  };
  
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">ELVORA Admin Login</h1>
        <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border p-2 rounded mb-3" />
        <input type="password" required placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border p-2 rounded mb-3" />
        <button className="w-full bg-primary text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}