import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

export default function MyOrders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => { api('/orders/my-orders').then(setOrders); }, []);
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('myOrders')}</h1>
      <div className="space-y-3">
        {orders.map(o => (
          <Link key={o._id} to={`/orders/${o._id}`} className="block bg-white p-4 rounded shadow hover:shadow-lg">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <div className="font-bold">{o.orderNumber}</div>
                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="font-bold text-primary">Rs. {o.totalPrice}</div>
              <span className={`px-3 py-1 rounded text-xs text-white ${
                o.orderStatus === 'Delivered' ? 'bg-accent' :
                o.orderStatus === 'Cancelled' ? 'bg-red-500' : 'bg-secondary'
              }`}>{o.orderStatus}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}