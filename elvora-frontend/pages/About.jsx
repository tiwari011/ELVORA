import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('aboutTitle')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('aboutSubtitle')}</p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">{t('whoWeAre')}</h2>
          <p className="text-gray-700 leading-7 mb-4">{t('whoWeAreDesc1')}</p>
          <p className="text-gray-700 leading-7">{t('whoWeAreDesc2')}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4"><h3 className="text-2xl font-bold text-blue-600">100+</h3><p className="text-gray-600 text-sm">{t('products100')}</p></div>
            <div className="p-4"><h3 className="text-2xl font-bold text-blue-600">24/7</h3><p className="text-gray-600 text-sm">{t('support247')}</p></div>
            <div className="p-4"><h3 className="text-2xl font-bold text-blue-600">⚡</h3><p className="text-gray-600 text-sm">{t('fastDelivery')}</p></div>
            <div className="p-4"><h3 className="text-2xl font-bold text-blue-600">🔒</h3><p className="text-gray-600 text-sm">{t('securePayment')}</p></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('missionTitle')}</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-7">{t('missionDesc')}</p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">{t('valuesTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: t('trust'), desc: t('trustDesc') },
            { title: t('quality'), desc: t('qualityDesc') },
            { title: t('innovation'), desc: t('innovationDesc') },
          ].map((v, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-14 text-center">
        <h2 className="text-3xl font-bold mb-3">{t('ctaTitle')}</h2>
        <p className="text-gray-300 mb-6">{t('ctaSubtitle')}</p>
        <a href="/products" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition">
          {t('exploreProducts')}
        </a>
      </section>
    </div>
  );
}
