import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useLanguage();

  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
    { q: t('faqQ5'), a: t('faqA5') },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t('faqTitle')}</h1>
        <p className="text-gray-300">{t('faqSubtitle')}</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden transition">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-5 text-left"
            >
              <span className="font-semibold text-gray-800">{item.q}</span>
              <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 text-gray-600">{item.a}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
