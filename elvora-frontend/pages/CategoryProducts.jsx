import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryProducts() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [data, setData] = useState({ category: null, products: [] });
  
  useEffect(() => { api(`/products/category/${slug}`).then(setData); }, [slug]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.category?.name[language]}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.products.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}