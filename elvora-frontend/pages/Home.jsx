import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    api('/categories')
      .then(data => {
        setCategories(Array.isArray(data) ? data : data.categories || []);
      })
      .catch(() => setCategories([]));

    api('/products?limit=8')
      .then(d => setFeatured(d.products || []))
      .catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev === categories.length - 1 ? 0 : prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [categories]);

  return (
    <div className="bg-gray-100">

      {/* HERO */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {t('heroSubtitle')}
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                {t('shopNow')}
              </Link>
              <Link
                to="/products"
                className="border border-gray-400 hover:bg-white hover:text-black transition px-6 py-3 rounded-lg font-semibold"
              >
                {t('exploreDeals')}
              </Link>
            </div>
          </div>

          {/* Carousel */}
          <div className="hidden md:block">
            <div className="relative w-[350px] h-[250px] flex items-center justify-center overflow-hidden">
              {Array.isArray(categories) && categories.map((cat, index) => {
                const isActive = index === currentIndex;
                const isPrev = index === (currentIndex - 1 + categories.length) % categories.length;
                const isNext = index === (currentIndex + 1) % categories.length;

                return (
                  <img
                    key={cat._id}
                    src={cat.image}
                    alt="category"
                    className={`absolute w-[80%] h-full object-cover rounded-xl shadow-xl transition-all duration-700 ease-in-out
                      ${isActive ? "z-20 scale-100 opacity-100 translate-x-0" : ""}
                      ${isPrev ? "z-10 scale-90 opacity-60 -translate-x-12" : ""}
                      ${isNext ? "z-10 scale-90 opacity-60 translate-x-12" : ""}
                      ${!isActive && !isPrev && !isNext ? "opacity-0 scale-75" : ""}
                    `}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {t('categories')}
          </h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 font-medium hover:underline"
          >
            {showAll ? t('showLess') : t('viewAll')}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500">
          {Array.isArray(categories) && (showAll ? categories : categories.slice(0, 8)).map(cat => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={cat.image || '/placeholder.png'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {cat.name[language]}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-14 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            🔥 {t('featuredProducts')}
          </h2>
          <button
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="text-blue-600 font-medium hover:underline"
          >
            {showAllProducts ? t('showLess') : t('viewAll')}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500">
          {Array.isArray(featured) && (showAllProducts ? featured : featured.slice(0, 4)).map(p => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-3"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="py-14 bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: t('fastDelivery') },
            { icon: '💰', title: t('bestPrices') },
            { icon: '🛡️', title: t('warranty') },
            { icon: '📞', title: t('support247') },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-gray-50 hover:bg-gray-100 transition p-6 rounded-xl shadow-sm"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}



