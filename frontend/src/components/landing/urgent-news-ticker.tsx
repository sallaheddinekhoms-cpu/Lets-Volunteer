"use client"

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export interface UrgentAlert {
  id: string;
  title: string;
  link?: string;
  wilaya?: string;
  date?: string;
}

interface UrgentNewsTickerProps {
  alerts?: UrgentAlert[];
}

export default function UrgentNewsTicker({ alerts = [] }: UrgentNewsTickerProps) {
  const { lang, dir } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Sample default alerts if none provided from database
  const activeAlerts: UrgentAlert[] = alerts.length > 0 ? alerts : [
    {
      id: 'default-1',
      title: lang === 'ar'
        ? 'نداء عاجل: حملة تبرع بالدم على مستوى بنك الدم المركزي بالمستشفى الجامعي بسطيف'
        : 'Urgent Call: Blood donation drive at Central Blood Bank, Setif University Hospital',
      link: '/opportunities',
      wilaya: lang === 'ar' ? 'سطيف' : 'Setif'
    },
    {
      id: 'default-2',
      title: lang === 'ar'
        ? 'تطوع إغاثي: فتح باب التطوع للمساهمة في توضيب القفف التضامنية الشتوية'
        : 'Relief Volunteering: Registration open to pack winter solidarity food parcels',
      link: '/opportunities',
      wilaya: lang === 'ar' ? 'الجزائر العاصمة' : 'Algiers'
    }
  ];

  useEffect(() => {
    if (activeAlerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAlerts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeAlerts.length]);

  if (!isVisible || activeAlerts.length === 0) return null;

  const currentAlert = activeAlerts[currentIndex];

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md relative z-40 border-b border-red-700/30" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
            </span>
            <div className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 border border-white/25">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-300" />
              <span>{lang === 'ar' ? 'عاجل وهام' : 'Urgent Alert'}</span>
            </div>
          </div>

          {/* Ticker Content */}
          <div className="flex-1 overflow-hidden relative min-h-[26px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAlert.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-3 w-full"
              >
                {currentAlert.wilaya && (
                  <span className="bg-black/20 text-yellow-200 text-xs px-2 py-0.5 rounded font-medium shrink-0">
                    {currentAlert.wilaya}
                  </span>
                )}
                <p className="text-sm font-medium truncate flex-1 hover:underline cursor-pointer">
                  {currentAlert.link ? (
                    <Link href={currentAlert.link} className="flex items-center gap-1.5 hover:text-yellow-100 transition-colors">
                      <span className="truncate">{currentAlert.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 inline shrink-0 opacity-80" />
                    </Link>
                  ) : (
                    currentAlert.title
                  )}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {activeAlerts.length > 1 && (
              <div className="hidden sm:flex items-center gap-0.5 ml-2">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + activeAlerts.length) % activeAlerts.length)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/90"
                  title={lang === 'ar' ? 'السابق' : 'Previous'}
                  aria-label="Previous alert"
                >
                  {dir === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs text-white/80 px-1 font-mono">
                  {currentIndex + 1}/{activeAlerts.length}
                </span>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % activeAlerts.length)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/90"
                  title={lang === 'ar' ? 'التالي' : 'Next'}
                  aria-label="Next alert"
                >
                  {dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            )}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
              aria-label="Close alert banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
