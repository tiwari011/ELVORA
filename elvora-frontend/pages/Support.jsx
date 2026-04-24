import { Mail, Phone, MessageCircle, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Support() {
  const { t } = useLanguage();

  const helpOptions = [
    { title: t('orderIssues'), desc: t('orderIssuesDesc') },
    { title: t('paymentHelp'), desc: t('paymentHelpDesc') },
    { title: t('deliverySupport'), desc: t('deliverySupportDesc') },
    { title: t('returnsRefunds'), desc: t('returnsRefundsDesc') },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t('supportTitle')}</h1>
        <p className="text-gray-300">{t('supportSubtitle')}</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="mailto:support@elvora.com" className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition text-center group">
            <Mail className="mx-auto text-blue-600 group-hover:scale-110 transition" size={28} />
            <h3 className="font-semibold mt-2">{t('emailSupport')}</h3>
            <p className="text-xs text-gray-500 mt-1">{t('emailSupportDesc')}</p>
          </a>
          <a href="tel:+919800000000" className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition text-center group">
            <Phone className="mx-auto text-green-600 group-hover:scale-110 transition" size={28} />
            <h3 className="font-semibold mt-2">{t('callSupport')}</h3>
            <p className="text-xs text-gray-500 mt-1">{t('callSupportDesc')}</p>
          </a>
          <a href="https://wa.me/919800000000" target="_blank" rel="noreferrer" className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition text-center group">
            <MessageCircle className="mx-auto text-green-500 group-hover:scale-110 transition" size={28} />
            <h3 className="font-semibold mt-2">{t('whatsapp')}</h3>
            <p className="text-xs text-gray-500 mt-1">{t('whatsappDesc')}</p>
          </a>
          <a href="/service-centers" className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition text-center group">
            <Building2 className="mx-auto text-purple-600 group-hover:scale-110 transition" size={28} />
            <h3 className="font-semibold mt-2">{t('serviceCenters')}</h3>
            <p className="text-xs text-gray-500 mt-1">{t('serviceCentersDesc')}</p>
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('howCanWeHelp')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {helpOptions.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold mb-2">{t('immediateHelp')}</h2>
          <p className="text-gray-600 mb-6">{t('immediateHelpDesc')}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">{t('contactSupportBtn')}</a>
            <a href="/orders" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition">{t('viewMyOrders')}</a>
          </div>
        </div>
      </section>

      <section className="py-10 text-center">
        <p className="text-gray-600">
          {t('lookingAnswers')}{' '}
          <a href="/faq" className="text-blue-600 font-semibold hover:underline">{t('visitFAQ')}</a>
        </p>
      </section>
    </div>
  );
}
