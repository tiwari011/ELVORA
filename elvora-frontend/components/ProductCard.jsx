import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    try {
      await addToCart(product._id);
      toast.success('Added to cart');
    } catch (err) { toast.error(err.message); }
  };
  
  const primaryImg = product.images?.find(i => i.isPrimary) || product.images?.[0];
  
  return (
    <Link to={`/product/${product.slug}`} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img src={primaryImg?.url || '/placeholder.png'} alt={product.name[language]} className="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 h-10">{product.name[language]}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary font-bold">Rs. {product.finalPrice}</span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-gray-400 line-through">Rs. {product.price}</span>
          )}
        </div>
        <div className="text-xs text-yellow-500">★ {product.averageRating?.toFixed(1) || '0'} ({product.totalReviews})</div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-primary text-white py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
        >
          {product.stock === 0 ? t('outOfStock') : t('addToCart')}
        </button>
      </div>
    </Link>
  );
}