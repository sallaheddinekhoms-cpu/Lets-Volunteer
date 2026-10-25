"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Handshake } from 'lucide-react';
import Link from 'next/link';
import { Partner } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface PartnersSectionProps {
  partners: Partner[];
}

const defaultPartners = [
  { id: '1', name: 'الهلال الأحمر الجزائري', logo: '/logo.svg', website: 'https://cra.dz', description: 'شريك استراتيجي في العمل الإنساني والإغاثي' },
  { id: '2', name: 'الكشافة الإسلامية الجزائرية', logo: '/logo.svg', website: 'https://sma.dz', description: 'تأطير الشباب وتنمية روح المبادرة' },
  { id: '3', name: 'وزارة الشباب والرياضة', logo: '/logo.svg', website: '', description: 'رعاية ودعم المبادرات الشبابية الوطنية' },
  { id: '4', name: 'المرصد الوطني للمجتمع المدني', logo: '/logo.svg', website: '', description: 'ترقية العمل الجمعوي التطوعي' },
  { id: '5', name: 'مؤسسة أوريدو للعمل الخيري', logo: '/logo.svg', website: '', description: 'شريك الاتصالات والتحول الرقمي' },
];

const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
  const { lang, dir, t } = useLanguage();
  const displayPartners = partners && partners.length > 0 ? partners : defaultPartners;
  // Duplicate for seamless infinite marquee loop
  const marqueePartners = [...displayPartners, ...displayPartners];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 overflow-hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <Handshake className="w-4 h-4" />
            <span>{t("partners.badge", "شركاء الأثر والنجاح")}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t("partners.title", "المساهمون والشركاء الاستراتيجيون")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t("partners.subtitle", "نعتز بالتعاون مع كبرى الهيئات والمؤسسات الوطنية لدعم وتمكين العمل التطوعي في الجزائر")}
          </p>
        </motion.div>
      </div>

      {/* Marquee Banner Slider */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft fade gradients on edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white via-white/80 to-transparent"></div>

        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: [0, -1500] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {marqueePartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex items-center gap-4 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 w-72 shrink-0 group hover:border-primary/40"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={partner.logo || "/logo.svg"}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.svg";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {partner.description || "شريك داعم لمنصة لنتطوع"}
                </p>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[11px] font-medium text-secondary hover:underline mt-1"
                  >
                    زيارة الموقع <ExternalLink className="w-2.5 h-2.5 mr-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-primary/30 text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
        >
          <span>استعراض شبكة الشركاء كاملة</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default PartnersSection;
