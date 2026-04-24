import { useLanguage } from '../context/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();
  const sections = [
    { title: t('privacyCollect'), desc: t('privacyCollectDesc') },
    { title: t('privacyUse'), desc: t('privacyUseDesc') },
    { title: t('privacyProtection'), desc: t('privacyProtectionDesc') },
    { title: t('privacySharing'), desc: t('privacySharingDesc') },
    { title: t('privacyCookies'), desc: t('privacyCookiesDesc') },
  ];
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">{t('privacyTitle')}</h1>
        <p className="text-gray-300 mt-2">{t('privacySubtitle')}</p>
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
