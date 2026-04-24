import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  
  const load = () => api('/products?limit=100').then(d => setProducts(d.products));
  useEffect(() => { load(); }, []);
  
  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api(`/admin/products/${id}`, { method: 'DELETE', admin: true });
    toast.success('Deleted');
    load();
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/add" className="bg-primary text-white px-4 py-2 rounded">+ Add Product</Link>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b">
                <td className="p-2"><img src={p.images[0]?.url} className="w-12 h-12 object-cover rounded" /></td>
                <td className="p-2">{p.name.en}</td>
                <td className="p-2">Rs. {p.finalPrice}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2 space-x-2">
                  <Link to={`/admin/products/edit/${p._id}`} className="text-primary">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}