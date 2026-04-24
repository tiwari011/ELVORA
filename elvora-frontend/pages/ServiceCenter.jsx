import { useLanguage } from '../context/LanguageContext';

export default function ServiceCenter() {
  const { t } = useLanguage();
  const centers = [
    { name: 'ELVORA Care Kathmandu', phone: '+977 9800000001', city: 'Kathmandu', address: 'New Road, Kathmandu' },
    { name: 'ELVORA Care Pokhara', phone: '+977 9800000002', city: 'Pokhara', address: 'Lakeside, Pokhara' },
    { name: 'ELVORA Care Biratnagar', phone: '+977 9800000003', city: 'Biratnagar', address: 'Main Road, Biratnagar' },
    { name: 'ELVORA Care Birgunj', phone: '+977 9800000004', city: 'Birgunj', address: 'Ghantaghar, Birgunj' },
    { name: 'ELVORA Care Butwal', phone: '+977 9800000005', city: 'Butwal', address: 'Traffic Chowk, Butwal' },
    { name: 'ELVORA Care Dharan', phone: '+977 9800000006', city: 'Dharan', address: 'BP Chowk, Dharan' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t('serviceCenterTitle')}</h1>
        <p className="text-gray-300">{t('serviceCenterSubtitle')}</p>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {centers.map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-bold mb-2">{c.name}</h3>
              <p className="text-gray-600">📍 {c.address}</p>
              <p className="text-gray-600 mt-1">📞 {c.phone}</p>
              <span className="inline-block mt-3 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{c.city}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
