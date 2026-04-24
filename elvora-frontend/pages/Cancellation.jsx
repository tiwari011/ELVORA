import { useLanguage } from '../context/LanguageContext';

export default function Cancellation() {
  const { t } = useLanguage();
  const sections = [
    { title: t('cancelBeforeShipping'), desc: t('cancelBeforeShippingDesc') },
    { title: t('cancelAfterShipping'), desc: t('cancelAfterShippingDesc') },
    { title: t('cancelTimeWindow'), desc: t('cancelTimeWindowDesc') },
    { title: t('refundProcess'), desc: t('refundProcessDesc') },
    { title: t('nonCancellable'), desc: t('nonCancellableDesc') },
  ];
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">{t('cancellationTitle')}</h1>
        <p className="text-gray-300 mt-2">{t('cancellationSubtitle')}</p>
      </section>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {sections.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-bold text-lg mb-2">{s.title}</h2>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
