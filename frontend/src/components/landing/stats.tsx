"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, HeartHandshake, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StatsProps {
  statistics?: { value: string; label: string; color: string }[];
}

const StatsSection: React.FC<StatsProps> = ({ statistics }) => {
  const { lang, dir, t } = useLanguage();

  const items = [
    {
      value: statistics?.[2]?.value || "45,670+",
      label: t("stats.hours", "ساعات تطوع معتمدة"),
      icon: Clock,
      change: lang === 'ar' ? "موثقة رسمياً" : "Officially Certified",
      color: "from-emerald-500 to-teal-600",
    },
    {
      value: statistics?.[0]?.value || "5,230+",
      label: t("stats.volunteers", "متطوعين نشطين"),
      icon: Users,
      change: lang === 'ar' ? "في 58 ولاية" : "Across 58 Wilayas",
      color: "from-blue-500 to-indigo-600",
    },
    {
      value: statistics?.[1]?.value || "1,780+",
      label: t("stats.opportunities", "فرص تطوعية ومبادرات"),
      icon: HeartHandshake,
      change: lang === 'ar' ? "تأثير مجتمعي مباشر" : "Direct Impact",
      color: "from-amber-500 to-orange-600",
    },
    {
      value: "58",
      label: lang === 'ar' ? "ولاية مغطاة وطنياً" : "Provinces Covered",
      icon: MapPin,
      change: lang === 'ar' ? "تغطية شاملة 100%" : "100% Nationwide",
      color: "from-primary to-[#17B2A8]",
    },
  ];

  return (
    <section className="relative -mt-10 mb-16 z-20 px-4" dir={dir}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-border/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {items.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${stat.color} p-3 flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                    <span className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                      {stat.change}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
