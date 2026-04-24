
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { language, changeLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
const [placeholder, setPlaceholder] = useState('');
  const navigate = useNavigate();

  // ✅ fetch categories for smart search
  useEffect(() => {
    api('/categories').then(setCategories).catch(() => {});
  }, []);

  

  const words = [
  "Search for mixer...",
  "Search for chimney...",
  "Search for gas stove...",
  "Search for kitchen appliances..."
];

useEffect(() => {
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeout;

  const type = () => {
    const currentWord = words[wordIndex];

    if (!searchText) { // ✅ STOP when user types
      if (!isDeleting) {
        setPlaceholder(currentWord.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentWord.length) {
          isDeleting = true;
          timeout = setTimeout(type, 1500);
          return;
        }
      } else {
        setPlaceholder(currentWord.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      timeout = setTimeout(type, isDeleting ? 50 : 100);
    }
  };

  type();

  return () => clearTimeout(timeout); // ✅ CLEANUP
}, [searchText]); // ✅ dependency added
  // 🔥 smart search (category + product)
  const handleSearch = () => {
    const query = searchText.trim().toLowerCase();
    if (!query) return;

    // Try exact match first, then partial match
    const matchedCategory = categories.find(cat => {
      const name = (cat.name?.[language] || cat.name?.en || "")
        .toLowerCase()
        .trim();
      return name === query || name.includes(query) || query.includes(name);
    });

    if (matchedCategory) {
      navigate(`/products?category=${matchedCategory._id}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }

    setSearchText('');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-primary">
          ELVORA
        </Link>

        {/* 🔥 SEARCH BAR */}
        <div className="flex w-[40%] border rounded-lg overflow-hidden bg-gray-50 shadow-sm">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            onFocus={() => setPlaceholder("Search products...")}
            className="flex-1 px-4 py-2 outline-none bg-transparent"
          />

         <button
  onClick={handleSearch}
  className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 flex items-center justify-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.1-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-4">

          {/* LANGUAGE */}
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="ne">नेपाली</option>
            <option value="en">English</option>
          </select>

          {/* CART */}
          <Link to="/cart" className="relative text-xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="bg-primary text-white px-3 py-1 rounded"
              >
                {user?.name?.split(' ')[0]}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
                    {t('profile')}
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
                    {t('myOrders')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-primary">{t('login')}</Link>
              <Link to="/register" className="bg-primary text-white px-3 py-1 rounded hidden sm:inline">
                {t('register')}
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

