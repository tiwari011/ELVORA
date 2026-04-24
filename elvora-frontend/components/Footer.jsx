import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const [open, setOpen] = useState(null);
  const { t } = useLanguage();

  const toggle = (section) => setOpen(open === section ? null : section);

  const quickLinks = [
    { href: "/", label: t('home') },
    { href: "/products", label: t('products') },
    { href: "/about", label: t('about') },
    { href: "/profile", label: t('myAccount') },
    { href: "/orders", label: t('myOrders') },
  ];

  const supportLinks = [
    { href: "/contact", label: t('contactUs') },
    { href: "/faq", label: t('faqShort') },
    { href: "/shipping", label: t('shippingShort') },
    { href: "/support", label: t('helpSupport') },
    { href: "/service-centers", label: t('serviceCentersShort') },
  ];

  const policyLinks = [
    { href: "/terms", label: t('termsOfService') },
    { href: "/privacy", label: t('privacyPolicy') },
    { href: "/returns", label: t('returnPolicy') },
    { href: "/cancellation", label: t('orderCancellation') },
  ];

  return (
    <footer className="bg-dark text-white py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* DESKTOP VIEW */}
        <div className="hidden md:grid grid-cols-5 gap-8">

          {/* LOGO */}
          <div>
            <h3 className="text-xl font-bold text-secondary">ELVORA</h3>
            <p className="text-sm mt-2 text-gray-300">{t('footerTagline')}</p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold mb-2">{t('quickLinks')}</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              {quickLinks.map((l) => (
                <li key={l.href}><a href={l.href} className="hover:underline">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-2">{t('supportFooter')}</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              {supportLinks.map((l) => (
                <li key={l.href}><a href={l.href} className="hover:underline">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* TERMS */}
          <div>
            <h4 className="font-semibold mb-2">{t('termsAndPolicies')}</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              {policyLinks.map((l) => (
                <li key={l.href}><a href={l.href} className="hover:underline">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* SERVICES / CONTACT */}
          <div>
            <h4 className="font-semibold mb-2">{t('servicesFooter')}</h4>
            <p className="text-sm text-gray-300">support@elvora.com</p>
            <p className="text-sm text-gray-300">+977-9800000000</p>
            <p className="text-sm text-gray-300 mt-2">
              📍 ELVORA {t('serviceCentersShort')}, Kathmandu
            </p>
          </div>
        </div>

        {/* MOBILE VIEW (ACCORDION) */}
        <div className="md:hidden space-y-3">

          {/* LOGO */}
          <div className="pb-3 border-b border-gray-700">
            <h3 className="text-xl font-bold text-secondary">ELVORA</h3>
            <p className="text-sm text-gray-300 mt-1">{t('footerTagline')}</p>
          </div>

          {/* QUICK LINKS */}
          <div className="border-b border-gray-700 pb-2">
            <button onClick={() => toggle("quick")} className="w-full flex justify-between py-2 font-semibold">
              {t('quickLinks')} <span>{open === "quick" ? "−" : "+"}</span>
            </button>
            {open === "quick" && (
              <ul className="text-sm space-y-1 text-gray-300 pl-2">
                {quickLinks.map((l) => (
                  <li key={l.href}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            )}
          </div>

          {/* SUPPORT */}
          <div className="border-b border-gray-700 pb-2">
            <button onClick={() => toggle("support")} className="w-full flex justify-between py-2 font-semibold">
              {t('supportFooter')} <span>{open === "support" ? "−" : "+"}</span>
            </button>
            {open === "support" && (
              <ul className="text-sm space-y-1 text-gray-300 pl-2">
                {supportLinks.map((l) => (
                  <li key={l.href}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            )}
          </div>

          {/* TERMS */}
          <div className="border-b border-gray-700 pb-2">
            <button onClick={() => toggle("terms")} className="w-full flex justify-between py-2 font-semibold">
              {t('termsAndPolicies')} <span>{open === "terms" ? "−" : "+"}</span>
            </button>
            {open === "terms" && (
              <ul className="text-sm space-y-1 text-gray-300 pl-2">
                {policyLinks.map((l) => (
                  <li key={l.href}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            )}
          </div>

          {/* SERVICES */}
          <div>
            <button onClick={() => toggle("services")} className="w-full flex justify-between py-2 font-semibold">
              {t('servicesFooter')} <span>{open === "services" ? "−" : "+"}</span>
            </button>
            {open === "services" && (
              <div className="text-sm text-gray-300 pl-2">
                <p>support@elvora.com</p>
                <p>+977-9800000000</p>
                <p className="mt-2">📍 ELVORA {t('serviceCentersShort')}, Kathmandu</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-sm mt-8 text-gray-400 border-t border-gray-700 pt-4">
        {t('copyright')}
      </div>
    </footer>
  );
}
