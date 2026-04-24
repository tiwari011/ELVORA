import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  if (!cart.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">{t('emptyCart')}</h2>
        <Link to="/products" className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded">{t('continueShopping')}</Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('cart')}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {cart.items.map(item => (
            <div key={item._id} className="bg-white p-4 rounded shadow flex gap-4">
              <img src={item.product.images[0]?.url} alt="" className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name[language]}</h3>
                <p className="text-primary font-bold">Rs. {item.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => updateCartItem(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 border rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItem(item._id, item.quantity + 1)} className="w-8 h-8 border rounded">+</button>
                  <button onClick={() => removeFromCart(item._id)} className="ml-4 text-red-500">{t('remove')}</button>
                </div>
              </div>
              <div className="font-bold">Rs. {item.price * item.quantity}</div>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded shadow h-fit">
          <h3 className="font-bold mb-3">{t('orderSummary')}</h3>
          <div className="flex justify-between"><span>{t('subtotal')}:</span><span>Rs. {cart.totalAmount}</span></div>
          <div className="flex justify-between"><span>{t('shipping')}:</span><span>Free</span></div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold"><span>{t('total')}:</span><span>Rs. {cart.totalAmount}</span></div>
          <button onClick={() => navigate('/checkout')} className="w-full mt-4 bg-primary text-white py-2 rounded">{t('checkout')}</button>
        </div>
      </div>
    </div>
  );
}