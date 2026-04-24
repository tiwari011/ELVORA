import { useLanguage } from '../context/LanguageContext';

export default function Shipping() {
  const { t } = useLanguage();
  const sections = [
    { title: t('deliveryTime'), desc: t('deliveryTimeDesc') },
    { title: t('shippingCharges'), desc: t('shippingChargesDesc') },
    { title: t('orderTracking'), desc: t('orderTrackingDesc') },
    { title: t('packagingSafety'), desc: t('packagingSafetyDesc') },
  ];
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t('shippingTitle')}</h1>
        <p className="text-gray-300">{t('shippingSubtitle')}</p>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <h2 className="text-xl font-bold mb-2">{s.title}</h2>
            <p className="text-gray-600 leading-7">{s.desc}</p>
          </div>
        ))}
      </section>
      <section className="bg-white border-t py-10 text-center">
        <h2 className="text-xl font-bold mb-4">{t('needHelp')}</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">{t('contactSupport')}</a>
          <a href="/faq" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition">{t('visitFaq')}</a>
        </div>
      </section>
    </div>
  );
}
