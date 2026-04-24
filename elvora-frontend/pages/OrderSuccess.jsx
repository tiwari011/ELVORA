import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { t } = useLanguage();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="text-6xl text-accent mb-4">✓</div>
      <h1 className="text-3xl font-bold">{t('orderPlaced')}</h1>
      <p className="mt-2 text-gray-600">{t('orderId')}: {orderId}</p>
      <div className="mt-6 space-x-4">
        <Link to={`/orders/${orderId}`} className="bg-primary text-white px-6 py-2 rounded">{t('viewOrder')}</Link>
        <Link to="/products" className="bg-gray-200 px-6 py-2 rounded">{t('continueShopping')}</Link>
      </div>
    </div>
  );
}
