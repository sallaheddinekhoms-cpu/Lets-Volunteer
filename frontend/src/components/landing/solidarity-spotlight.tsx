"use client";

import React from "react";
import { motion } from "framer-motion";
import { Handshake, Phone, ArrowLeft, ArrowRight, Heart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const sampleItems = [
  {
    id: 1,
    title: "كرسي متحرك طبي قابل للطي",
    type: "LEND",
    typeLabel: "إعارة مجانية مؤقتة",
    category: "معدات حركية",
    wilaya: "الجزائر",
    condition: "ممتازة شبه جديد",
    phone: "0551234567",
    whatsapp: "213551234567",
  },
  {
    id: 2,
    title: "عكازان طبيان ألومنيوم مع مقابض مرنة",
    type: "LEND",
    typeLabel: "إعارة مجانية مؤقتة",
    category: "معدات حركية",
    wilaya: "البليدة",
    condition: "جيدة جداً",
    phone: "0662345678",
    whatsapp: "213662345678",
  },
  {
    id: 3,
    title: "جهاز قياس ضغط الدم إلكتروني مع حقيبة",
    type: "DONATION",
    typeLabel: "تبرع دائم نهائي",
    category: "أجهزة طبية",
    wilaya: "سطيف",
    condition: "جديد بالعلبة",
    phone: "0773456789",
    whatsapp: null,
  },
];

export default function SolidaritySpotlight() {
  const { lang, dir, t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 border-t border-border/70" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold">
              <Handshake className="w-3.5 h-3.5" />
              <span>{t("store.badge", "متجر التطوع والتكافل الصحي")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {lang === 'ar' ? "عطاء مجتمعي.. من مواطن إلى مواطن " : "Community Giving.. From Citizen to Citizen "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                {lang === 'ar' ? "لوجه الله" : "For Good"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              {t("store.subtitle", "هل تملك كرسياً متحركاً، عكازاً، أو جهازاً طبياً لا تستعمله؟ أودعه في المتجر لإعارته مجاناً لمن هم في أمس الحاجة إليه.")}
            </p>
          </div>

          <Link href="/solidarity-store">
            <Button className="bg-primary hover:bg-[#105D56]/90 text-white rounded-xl px-5 py-2.5 font-bold text-sm flex items-center gap-2">
              <span>{t("store.ctaBrowse", "عرض كافة الأغراض في المتجر")}</span>
              {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {sampleItems.map((item, index) => {
            const isLend = item.type === "LEND";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      isLend ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {lang === 'ar' ? item.typeLabel : (isLend ? "Free Temporary Loan" : "Permanent Donation")}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {lang === 'ar' ? `الحالة: ${item.condition}` : `Condition: Good`}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{lang === 'ar' ? `ولاية ${item.wilaya}` : `Wilaya of ${item.wilaya}`}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 mt-5 border-t border-border flex items-center justify-between gap-3">
                  <a
                    href={`tel:${item.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? "طلب واستلام" : "Request Item"}</span>
                  </a>
                  {item.whatsapp && (
                    <a
                      href={`https://wa.me/${item.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200 text-xs font-bold"
                      title="WhatsApp"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Deposit CTA Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary to-[#17B2A8] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 fill-white text-white" />
              <span>{lang === 'ar' ? "هل تملك عتاداً أو مستلزمات ترغب في التبرع بها أو إعارتها؟" : "Have items or medical equipment to donate or lend?"}</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/90">
              {lang === 'ar'
                ? "أضف غرضك الآن للمتجر خلال دقيقة واحدة، وسيتواصل معك المحتاجون أو الجمعيات مباشرة."
                : "List your item now in under a minute, and verified beneficiaries or organizations will connect directly."}
            </p>
          </div>
          <Link href="/solidarity-store">
            <Button className="bg-white hover:bg-white/90 text-primary font-bold px-6 py-5 rounded-xl shadow-md text-sm whitespace-nowrap">
              {t("store.ctaAdd", "إيداع غرض جديد في المتجر")}
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
