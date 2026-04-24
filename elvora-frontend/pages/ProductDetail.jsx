import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  
  useEffect(() => {
    api(`/products/${slug}`).then(p => {
      setProduct(p);
      api(`/reviews/product/${p._id}`).then(setReviews);
    });
  }, [slug]);
  
  if (!product) return <div className="p-8 text-center">{t('loading')}</div>;
  
  const handleAdd = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await addToCart(product._id, qty);
      toast.success('Added to cart');
    } catch (err) { toast.error(err.message); }
  };
  
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api('/reviews', { method: 'POST', body: { productId: product._id, ...reviewData } });
      toast.success('Review added');
      const updated = await api(`/reviews/product/${product._id}`);
      setReviews(updated);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) { toast.error(err.message); }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 aspect-square rounded-lg overflow-hidden">
            <img src={product.images[activeImg]?.url} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 mt-4">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 border-2 rounded ${activeImg === i ? 'border-primary' : 'border-gray-200'}`}>
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{product.name[language]}</h1>
          <div className="mt-2 text-yellow-500">★ {product.averageRating?.toFixed(1)} ({product.totalReviews} {t('reviews')})</div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">Rs. {product.finalPrice}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">Rs. {product.price}</span>
                <span className="bg-accent text-white px-2 py-1 text-xs rounded">{product.discountPercentage}% OFF</span>
              </>
            )}
          </div>
          <p className="mt-4 text-gray-700">{product.description[language]}</p>
          <div className="mt-4">Stock: <strong>{product.stock > 0 ? product.stock : t('outOfStock')}</strong></div>
          
          {product.stock > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <input type="number" min="1" max={product.stock} value={qty} onChange={e => setQty(Number(e.target.value))} className="w-20 border p-2 rounded" />
              <button onClick={handleAdd} className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">
                {t('addToCart')}
              </button>
            </div>
          )}
          
          {product.features?.[language]?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">{t('features')}</h3>
              <ul className="list-disc pl-5">
                {product.features[language].map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {product.specifications?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">{t('specifications')}</h2>
          <table className="w-full border">
            <tbody>
              {product.specifications.map((s, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3 font-semibold bg-gray-50 w-1/3">{s.key[language]}</td>
                  <td className="p-3">{s.value[language]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t('reviews')}</h2>
        {isAuthenticated && (
          <form onSubmit={submitReview} className="bg-white p-4 rounded shadow mb-6">
            <select value={reviewData.rating} onChange={e => setReviewData({ ...reviewData, rating: Number(e.target.value) })} className="border p-2 rounded mb-2">
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
            </select>
            <textarea required value={reviewData.comment} onChange={e => setReviewData({ ...reviewData, comment: e.target.value })} placeholder="Your review..." className="w-full border p-2 rounded mb-2" />
            <button className="bg-primary text-white px-4 py-2 rounded">Submit Review</button>
          </form>
        )}
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <strong>{r.user.name}</strong>
                <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
              </div>
              {r.isVerifiedPurchase && <span className="text-xs text-accent">✓ Verified Purchase</span>}
              <p className="mt-2">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}