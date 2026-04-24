import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [form, setForm] = useState({
    nameEn: '', nameNe: '', descEn: '', descNe: '',
    category: '', price: '', discountPercentage: 0, stock: '',
    featuresEn: '', featuresNe: '', warrantyEn: '', warrantyNe: '',
    isActive: true, isFeatured: false,
  });
  const [specs, setSpecs] = useState([{ keyEn: '', keyNe: '', valueEn: '', valueNe: '' }]);
  
  useEffect(() => {
    api('/categories').then(setCategories);
    if (id) {
      // Fetch product by ID for editing
      api(`/products/by-id/${id}`).then(p => {
        setForm({
          nameEn: p.name.en, nameNe: p.name.ne,
          descEn: p.description.en, descNe: p.description.ne,
          category: p.category._id || p.category, price: p.price,
          discountPercentage: p.discountPercentage, stock: p.stock,
          featuresEn: p.features?.en?.join('\n') || '',
          featuresNe: p.features?.ne?.join('\n') || '',
          warrantyEn: p.warranty?.en || '', warrantyNe: p.warranty?.ne || '',
          isActive: p.isActive, isFeatured: p.isFeatured,
        });
        if (p.specifications?.length) {
          setSpecs(p.specifications.map(s => ({
            keyEn: s.key.en, keyNe: s.key.ne, valueEn: s.value.en, valueNe: s.value.ne,
          })));
        }
        // Load existing images as previews (sorted with primary first)
        const sortedImages = [...(p.images || [])].sort((a, b) => (b.isPrimary ? -1 : 0));
        setPreviews(sortedImages.map(img => img.url));
      }).catch(err => {
        console.error('Failed to load product:', err);
      });
    }
  }, [id]);
  
  const addSpec = () => setSpecs([...specs, { keyEn: '', keyNe: '', valueEn: '', valueNe: '' }]);
  const removeSpec = (i) => setSpecs(specs.filter((_, x) => x !== i));
  
  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', JSON.stringify({ en: form.nameEn, ne: form.nameNe }));
    fd.append('description', JSON.stringify({ en: form.descEn, ne: form.descNe }));
    fd.append('category', form.category);
    fd.append('price', form.price);
    fd.append('discountPercentage', form.discountPercentage);
    fd.append('stock', form.stock);
    fd.append('features', JSON.stringify({
      en: form.featuresEn.split('\n').filter(Boolean),
      ne: form.featuresNe.split('\n').filter(Boolean),
    }));
    fd.append('warranty', JSON.stringify({ en: form.warrantyEn, ne: form.warrantyNe }));
    fd.append('specifications', JSON.stringify(specs.map(s => ({
      key: { en: s.keyEn, ne: s.keyNe },
      value: { en: s.valueEn, ne: s.valueNe },
    }))));
    fd.append('isActive', form.isActive);
    fd.append('isFeatured', form.isFeatured);
    files.forEach(f => fd.append('images', f));
    
    try {
      if (id) {
        await api(`/admin/products/${id}`, { method: 'PUT', body: fd, admin: true });
        toast.success('Updated');
      } else {
        await api('/admin/products', { method: 'POST', body: fd, admin: true });
        toast.success('Added');
      }
      navigate('/admin/products');
    } catch (err) { toast.error(err.message); }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Name (English)" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} className="border p-2 rounded" />
          <input required placeholder="Name (Nepali)" value={form.nameNe} onChange={e => setForm({ ...form, nameNe: e.target.value })} className="border p-2 rounded" />
          <textarea required placeholder="Description (English)" value={form.descEn} onChange={e => setForm({ ...form, descEn: e.target.value })} className="border p-2 rounded col-span-2" />
          <textarea required placeholder="Description (Nepali)" value={form.descNe} onChange={e => setForm({ ...form, descNe: e.target.value })} className="border p-2 rounded col-span-2" />
          <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border p-2 rounded">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name.en}</option>)}
          </select>
          <input type="number" required placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border p-2 rounded" />
          <input type="number" placeholder="Discount %" value={form.discountPercentage} onChange={e => setForm({ ...form, discountPercentage: e.target.value })} className="border p-2 rounded" />
          <input type="number" required placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="border p-2 rounded" />
          <textarea placeholder="Features EN (one per line)" value={form.featuresEn} onChange={e => setForm({ ...form, featuresEn: e.target.value })} className="border p-2 rounded col-span-2" />
          <textarea placeholder="Features NE (one per line)" value={form.featuresNe} onChange={e => setForm({ ...form, featuresNe: e.target.value })} className="border p-2 rounded col-span-2" />
          <input placeholder="Warranty EN" value={form.warrantyEn} onChange={e => setForm({ ...form, warrantyEn: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Warranty NE" value={form.warrantyNe} onChange={e => setForm({ ...form, warrantyNe: e.target.value })} className="border p-2 rounded" />
        </div>
        
        <div>
          <label className="block mb-1 font-semibold">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => {
              const selected = Array.from(e.target.files);
              setFiles(selected);
              // Generate previews
              const urls = selected.map(f => URL.createObjectURL(f));
              setPreviews(urls);
              setPrimaryIndex(0);
            }}
          />
          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((url, idx) => (
                <div key={idx} className={`relative border-2 ${idx === primaryIndex ? 'border-green-500' : 'border-gray-300'} rounded p-1`}>
                  <img src={url} alt={`Preview ${idx}`} className="w-20 h-20 object-cover rounded" />
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    {idx === 0 && <span className="bg-green-500 text-white text-xs px-1 rounded">Primary</span>}
                    <button
                      type="button"
                      onClick={() => {
                        // Reorder: move this image to position 0 (primary)
                        const newFiles = [...files];
                        const [moved] = newFiles.splice(idx, 1);
                        newFiles.unshift(moved);
                        setFiles(newFiles);
                        const newPreviews = [...previews];
                        const [movedPreview] = newPreviews.splice(idx, 1);
                        newPreviews.unshift(movedPreview);
                        setPreviews(newPreviews);
                        setPrimaryIndex(0);
                      }}
                      className="bg-blue-500 text-white text-xs px-1 rounded hover:bg-blue-600"
                    >
                      Set Primary
                    </button>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          // Move up
                          const newFiles = [...files];
                          [newFiles[idx-1], newFiles[idx]] = [newFiles[idx], newFiles[idx-1]];
                          setFiles(newFiles);
                          const newPreviews = [...previews];
                          [newPreviews[idx-1], newPreviews[idx]] = [newPreviews[idx], newPreviews[idx-1]];
                          setPreviews(newPreviews);
                          if (primaryIndex === idx) setPrimaryIndex(idx - 1);
                          else if (primaryIndex === idx - 1) setPrimaryIndex(idx);
                        }}
                        className="bg-gray-500 text-white text-xs px-1 rounded hover:bg-gray-600"
                      >
                        ↑
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = files.filter((_, i) => i !== idx);
                        setFiles(newFiles);
                        const newPreviews = previews.filter((_, i) => i !== idx);
                        setPreviews(newPreviews);
                        if (idx < primaryIndex) setPrimaryIndex(primaryIndex - 1);
                        else if (idx === primaryIndex) setPrimaryIndex(Math.max(0, primaryIndex - 1));
                      }}
                      className="bg-red-500 text-white text-xs px-1 rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-bold mb-2">Specifications</h3>
          {specs.map((s, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2">
              <input placeholder="Key EN" value={s.keyEn} onChange={e => { const c = [...specs]; c[i].keyEn = e.target.value; setSpecs(c); }} className="border p-2 rounded" />
              <input placeholder="Key NE" value={s.keyNe} onChange={e => { const c = [...specs]; c[i].keyNe = e.target.value; setSpecs(c); }} className="border p-2 rounded" />
              <input placeholder="Value EN" value={s.valueEn} onChange={e => { const c = [...specs]; c[i].valueEn = e.target.value; setSpecs(c); }} className="border p-2 rounded" />
              <div className="flex gap-1">
                <input placeholder="Value NE" value={s.valueNe} onChange={e => { const c = [...specs]; c[i].valueNe = e.target.value; setSpecs(c); }} className="border p-2 rounded flex-1" />
                <button type="button" onClick={() => removeSpec(i)} className="text-red-500">✕</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addSpec} className="text-primary">+ Add Specification</button>
        </div>
        
        <div className="flex gap-4">
          <label><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <label><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
        </div>
        
        <button className="bg-primary text-white px-6 py-2 rounded">Save</button>
      </form>
    </div>
  );
}