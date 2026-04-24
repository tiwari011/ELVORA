import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

export default function OrderDetails() {
  const { orderId } = useParams();
  const { t } = useLanguage();
  const [order, setOrder] = useState(null);

  useEffect(() => { api(`/orders/${orderId}`).then(setOrder); }, [orderId]);
  if (!order) return <div className="p-8">{t('loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t('orderTitle')} {order.orderNumber}</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>{t('status')}:</strong> {order.orderStatus}</p>
        <p><strong>{t('payment')}:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
        <p><strong>{t('date')}:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-bold mb-2">{t('items')}</h3>
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between py-2 border-b">
            <span>{i.name} x {i.quantity}</span>
            <span>Rs. {i.price * i.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3">
          <span>{t('total')}:</span><span>Rs. {order.totalPrice}</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">{t('shippingAddress')}</h3>
        <p>{order.shippingAddress.name} ({order.shippingAddress.phone})</p>
        <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
      </div>
    </div>
  );
}
