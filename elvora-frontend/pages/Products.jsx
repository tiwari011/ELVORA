
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const { t, language } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    category: params.get('category') || '',
    search: params.get('search') || '',
    sort: params.get('sort') || '',
    page: 1,
  });

  // Controlled search input - sync with URL search param
  const [searchInput, setSearchInput] = useState(params.get('search') || '');

  // Sync filters to URL
  useEffect(() => {
    const { category, search, sort, page } = filters;
    setParams({
      category,
      search,
      sort,
      page: page > 1 ? page : undefined,
    });
  }, [filters, setParams]);

  // Fetch categories
  useEffect(() => {
    api('/categories')
      .then(setCategories)
      .catch(() => setError('Failed to load categories'));
  }, []);

  // Debounced search with category matching (only when user types in the sidebar search)
  useEffect(() => {
    // Don't run if we already have a category set (came from navbar)
    if (filters.category) return;

    const delay = setTimeout(() => {
      const query = searchInput.toLowerCase().trim();

      if (!query) {
        setFilters(prev => ({
          ...prev,
          search: '',
          category: '',
          page: 1,
        }));
        return;
      }

      // First try exact match, then partial match
      const matchedCategory = categories.find(cat => {
        const name = (cat.name?.[language] || cat.name?.en || "")
          .toLowerCase()
          .trim();
        return name === query || name.includes(query) || query.includes(name);
      });

      if (matchedCategory) {
        setFilters(prev => ({
          ...prev,
          category: matchedCategory._id,
          search: '',
          page: 1,
        }));
      } else {
        setFilters(prev => ({
          ...prev,
          search: query,
          category: '',
          page: 1,
        }));
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput, categories, language, filters.category]);
  // Fetch products
  useEffect(() => {
    const abortController = new AbortController();

    const fetchProducts = async () => {
      setError(null);
      setLoading(true);
      try {
        const qs = Object.entries(filters)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}=${v}`)
          .join('&');

        const d = await api(`/products?${qs}`);

        if (!abortController.signal.aborted) {
          setProducts(d.products);
          setPages(d.pages);
        }
      } catch {
        if (!abortController.signal.aborted) {
          setError('Failed to load products');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => abortController.abort();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-6">{t('products')}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">

        {/* FILTER SIDEBAR */}
        <aside className="bg-white p-4 rounded-xl shadow-sm h-fit">

          <h3 className="font-bold mb-4 text-lg">Filter</h3>

          {/* 🔥 FIXED INPUT */}
          <input
            type="text"
            placeholder={t('search')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none p-2 rounded mb-4"
          />

          <select
            value={filters.category}
            onChange={e =>
              setFilters({ ...filters, category: e.target.value, page: 1 })
            }
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>
                {c.name[language] || c.name.en || 'Unknown'}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={e =>
              setFilters({ ...filters, sort: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

        </aside>

        {/* PRODUCTS */}
        <div className="md:col-span-3">

          {loading ? (
            <div className="text-center py-10 text-gray-400 animate-pulse">
              Searching products...
            </div>
          ) : error ? null : products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No products found for "{searchInput}"
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-6 flex gap-2 justify-center items-center">
                  
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        page: Math.max(1, filters.page - 1),
                      })
                    }
                    disabled={filters.page === 1}
                    className="px-3 py-1 rounded bg-white border disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setFilters({ ...filters, page: i + 1 })
                      }
                      className={`px-3 py-1 rounded ${
                        filters.page === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        page: Math.min(pages, filters.page + 1),
                      })
                    }
                    disabled={filters.page === pages}
                    className="px-3 py-1 rounded bg-white border disabled:opacity-50"
                  >
                    Next
                  </button>

                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}