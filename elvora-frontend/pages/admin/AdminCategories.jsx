import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ nameEn: '', nameNe: '', descEn: '', descNe: '' });
  const [file, setFile] = useState(null);
  
  const load = () => api('/categories').then(setCats);
  useEffect(() => { load(); }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', JSON.stringify({ en: form.nameEn, ne: form.nameNe }));
    fd.append('description', JSON.stringify({ en: form.descEn, ne: form.descNe }));
    if (file) fd.append('image', file);
    try {
      await api('/admin/categories', { method: 'POST', body: fd, admin: true });
      toast.success('Added');
      setForm({ nameEn: '', nameNe: '', descEn: '', descNe: '' });
      setFile(null);
      load();
    } catch (err) { toast.error(err.message); }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 grid grid-cols-2 gap-3">
        <input required placeholder="Name EN" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} className="border p-2 rounded" />
        <input required placeholder="Name NE" value={form.nameNe} onChange={e => setForm({ ...form, nameNe: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Description EN" value={form.descEn} onChange={e => setForm({ ...form, descEn: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Description NE" value={form.descNe} onChange={e => setForm({ ...form, descNe: e.target.value })} className="border p-2 rounded" />
        <input type="file" onChange={e => setFile(e.target.files[0])} className="col-span-2" />
        <button className="bg-primary text-white py-2 rounded col-span-2">Add Category</button>
      </form>
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead><tr className="border-b bg-gray-50"><th className="p-2 text-left">Image</th><th className="p-2 text-left">Name EN</th><th className="p-2 text-left">Name NE</th><th className="p-2 text-left">Slug</th></tr></thead>
          <tbody>
            {cats.map(c => (
              <tr key={c._id} className="border-b">
                <td className="p-2"><img src={c.image} className="w-12 h-12 object-cover rounded" /></td>
                <td className="p-2">{c.name.en}</td>
                <td className="p-2">{c.name.ne}</td>
                <td className="p-2">{c.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}