import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  
  useEffect(() => { api(`/admin/orders/${id}`, { admin: true }).then(o => { setOrder(o); setStatus(o.orderStatus); }); }, [id]);
  
  const update = async () => {
    try {
      await api(`/admin/orders/${id}/status`, { method: 'PUT', body: { status }, admin: true });
      toast.success('Updated');
    } catch (err) { toast.error(err.message); }
  };
  
  if (!order) return <div>Loading...</div>;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order {order.orderNumber}</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p>Customer: {order.user?.name} ({order.user?.email})</p>
        <p>Payment: {order.paymentMethod} - {order.paymentStatus}</p>
        <p>Total: Rs. {order.totalPrice}</p>
        <div className="mt-3 flex gap-2">
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 rounded">
            {['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={update} className="bg-primary text-white px-4 py-2 rounded">Update Status</button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-bold mb-2">Items</h3>
        {order.items.map((i, x) => (
          <div key={x} className="flex justify-between py-2 border-b">
            <span>{i.name} x {i.quantity}</span>
            <span>Rs. {i.price * i.quantity}</span>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Shipping</h3>
        <p>{order.shippingAddress.name} - {order.shippingAddress.phone}</p>
        <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
      </div>
    </div>
  );
}