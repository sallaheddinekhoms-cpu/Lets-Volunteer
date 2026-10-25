"use client";

import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, ShieldCheck, HeartHandshake, Phone, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { lang, dir, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0b332e] text-white pt-16 pb-10 border-t border-white/10" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Vision (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="لنتطوع"
                width={100}
                height={50}
                className="brightness-0 invert object-contain"
              />
            </div>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t("footer.desc", "المنصة الوطنية الرقمية الأولى في الجزائر لربط المتطوعين بالفرص والمبادرات، وتوثيق الساعات بسجل وطني معتمد لدعم التكافل وبناء كفاءات الشباب.")}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#17B2A8] flex items-center justify-center transition-colors text-white"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#17B2A8] flex items-center justify-center transition-colors text-white"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#17B2A8] flex items-center justify-center transition-colors text-white"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className={`text-sm font-bold text-white tracking-wide ${dir === 'rtl' ? 'border-r-2 pr-2.5' : 'border-l-2 pl-2.5'} border-[#17B2A8]`}>
              {t("footer.servicesTitle", "خدمات المنصة")}
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">{t("nav.home", "الرئيسية")}</Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white hover:underline transition-colors">{lang === 'ar' ? 'دليل وخريطة الفرص التطوعية' : 'Volunteer Opportunities Map'}</Link>
              </li>
              <li>
                <Link href="/solidarity-store" className="hover:text-white hover:underline transition-colors">{t("nav.solidarityStore", "متجر التطوع والتكافل")}</Link>
              </li>
              <li>
                <Link href="/trainings" className="hover:text-white hover:underline transition-colors">{t("nav.trainings", "فضاء التكوين والتأهيل")}</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white hover:underline transition-colors">{t("nav.gallery", "معرض الصور والفيديو")}</Link>
              </li>
              <li>
                <Link href="/accreditation" className="hover:text-white hover:underline transition-colors">{t("nav.accreditation", "ميثاق الاعتماد وحقوق المتطوع")}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline transition-colors">{t("nav.contact", "اتصل بنا")}</Link>
              </li>
            </ul>
          </div>

          {/* Legal Compliance Notice (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className={`text-sm font-bold text-white tracking-wide ${dir === 'rtl' ? 'border-r-2 pr-2.5' : 'border-l-2 pl-2.5'} border-[#17B2A8]`}>
              {t("footer.legalTitle", "الضمانات القانونية")}
            </h4>
            <div className="space-y-2.5 text-[11px] text-white/70">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t("footer.law1206", "قانون الجمعيات رقم 12-06 المنظم للنشاطات.")}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t("footer.law1807", "قانون حماية المعطيات الشخصية رقم 18-07.")}</span>
              </div>
              <div className="flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-[#17B2A8] flex-shrink-0 mt-0.5" />
                <span>{t("footer.insurance", "تغطية تأمينية ميدانية للمتطوعين المعتمدين.")}</span>
              </div>
            </div>
          </div>

          {/* Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className={`text-sm font-bold text-white tracking-wide ${dir === 'rtl' ? 'border-r-2 pr-2.5' : 'border-l-2 pl-2.5'} border-[#17B2A8]`}>
              {t("footer.newsletterTitle", "النشرة البريدية")}
            </h4>
            <p className="text-xs text-white/70">
              {t("footer.newsletterDesc", "اشترك لتصلك أحدث الفرص التطوعية والحملات الإغاثية في ولايتك أولاً بأول:")}
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                {lang === 'ar' ? "تم اشتراكك بنجاح في النشرة الإخبارية!" : "Successfully subscribed to newsletter!"}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("footer.newsletterPlaceholder", "بريدك الإلكتروني...")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-xs outline-none focus:border-[#17B2A8] transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#17B2A8] hover:bg-[#17B2A8]/90 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-md"
                >
                  {t("footer.subscribe", "اشتراك مجاني")}
                </Button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright & National Seal */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center ${dir === 'rtl' ? 'sm:text-right' : 'sm:text-left'}`}>
          <p>
            {t("footer.rights", "© 2026 منصة «لنتطوع» الوطنية - الجمهورية الجزائرية الديمقراطية الشعبية. جميع الحقوق محفوظة.")}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/accreditation" className="hover:text-white transition-colors">
              {lang === 'ar' ? 'ميثاق الخصوصية' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <Link href="/accreditation" className="hover:text-white transition-colors">
              {lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
            </Link>
            <span>•</span>
            <Link href="/opportunities" className="hover:text-white transition-colors">
              {lang === 'ar' ? 'تغطية الولايات الـ 58' : '58 Wilayas Coverage'}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
