"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, HandHeart, School, BadgeCheck, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesHub() {
  const { lang, dir, t } = useLanguage();

  const services = [
    {
      icon: MapPin,
      title: lang === 'ar' ? "خريطة الفرص التفاعلية" : "Interactive Opportunities Map",
      tag: lang === 'ar' ? "تموضع جغرافي GPS" : "GPS Geolocation",
      description: lang === 'ar'
        ? "استكشف الفرص التطوعية المفتوحة بالقرب منك عبر الـ 58 ولاية بنظام الخرائط الحية وتعرف على نقاط الاتصال المعتمدة."
        : "Explore open volunteer opportunities near you across all 58 wilayas with live mapping and certified contact points.",
      href: "/opportunities",
      buttonText: lang === 'ar' ? "تصفح الخريطة" : "Browse Map",
      color: "from-teal-500 to-emerald-600",
      bgLight: "bg-teal-50",
    },
    {
      icon: HandHeart,
      title: t("services.storeTitle", "متجر التطوع والتكافل"),
      tag: lang === 'ar' ? "إعارة وتبرع مجاني" : "Free Loan & Giving",
      description: t("services.storeDesc", "مساحة مجانية لتبادل وإعارة المستلزمات الطبية (كراسي متحركة، عكازات، أجهزة تنفس) لوجه الله مع إمكانية التواصل المباشر."),
      href: "/solidarity-store",
      buttonText: lang === 'ar' ? "دخول المتجر" : "Enter Store",
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
    },
    {
      icon: School,
      title: t("services.trainingsTitle", "فضاء التكوين والتأهيل"),
      tag: lang === 'ar' ? "ساعات معتمدة رسمياً" : "Certified Hours",
      description: t("services.trainingsDesc", "أكاديمية تدريبية تصقل مهارات المتطوعين في الإسعافات الأولية، إدارة المخاطر والأزمات، وصناعة المحتوى التنموي."),
      href: "/trainings",
      buttonText: lang === 'ar' ? "استكشف الدورات" : "Explore Courses",
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
    },
    {
      icon: BadgeCheck,
      title: t("services.passportTitle", "جواز وبطاقة المتطوع الرقمية"),
      tag: lang === 'ar' ? "هوية وطنية موحدة" : "National ID",
      description: t("services.passportDesc", "سجل وطني غير قابل للتلاعب يوثق ساعاتك ومهاراتك وشهاداتك المعتمدة مع رمز الاستجابة السريعة QR."),
      href: "/accreditation",
      buttonText: lang === 'ar' ? "ميثاق الاعتماد" : "State Charter",
      color: "from-primary to-[#17B2A8]",
      bgLight: "bg-emerald-50",
    },
  ];

  return (
    <section className="py-20 bg-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("services.badge", "منظومة متكاملة لخدمة المجتمع")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {t("services.title", "كل ما يحتاجه المتطوع في ")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#17B2A8] to-primary">
              {t("services.titleHighlight", "مكان واحد")}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {t("services.subtitle", "خدمات متطورة مبنية بمعايير تقنية وقانونية رفيعة ترقى لتمثيل العمل التطوعي الوطني.")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-border hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} p-3 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.bgLight} text-foreground/80 border border-border/50`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Button */}
                <div className="pt-6 mt-6 border-t border-border/50">
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 hover:bg-transparent text-primary hover:text-secondary font-bold text-xs sm:text-sm group-hover:translate-x-1 transition-transform"
                    >
                      <span>{item.buttonText}</span>
                      {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 ml-1" /> : <ArrowRight className="w-4 h-4 mr-1" />}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
