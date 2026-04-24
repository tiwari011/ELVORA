import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success(t('register'));
      navigate('/');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('registerTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder={t('fullName')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border p-2 rounded" />
        <input type="email" required placeholder={t('email')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border p-2 rounded" />
        <input required placeholder={t('phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border p-2 rounded" />
        <input type="password" required placeholder={t('password')} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border p-2 rounded" />
        <button className="w-full bg-primary text-white py-2 rounded">{t('registerBtn')}</button>
      </form>
      <p className="mt-3 text-sm">{t('haveAccount')} <Link to="/login" className="text-primary">{t('login')}</Link></p>
    </div>
  );
}
