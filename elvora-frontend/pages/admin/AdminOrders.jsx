import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  
  const load = useCallback(() => {
    const qs = filter ? `?status=${filter}` : '';
    api(`/admin/orders${qs}`, { admin: true }).then(setOrders);
  }, [filter]);

  useEffect(() => { load(); }, [load]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded mb-4">
        <option value="">All Statuses</option>
        {['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
      </select>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Order #</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-b">
                <td className="p-2">{o.orderNumber}</td>
                <td className="p-2">{o.user?.name}</td>
                <td className="p-2">Rs. {o.totalPrice}</td>
                <td className="p-2">{o.paymentMethod}</td>
                <td className="p-2">{o.orderStatus}</td>
                <td className="p-2"><Link to={`/admin/orders/${o._id}`} className="text-primary">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}