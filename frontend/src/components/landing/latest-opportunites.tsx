"use client";

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LatestOpportunityCard } from './cards/latest_opportunity-card';
import { OpportunityForCardList } from '@/types/opportunity';
import { useLanguage } from '@/context/LanguageContext';

const LatestOpportunitiesSection = ({
  latestOpportunities,
}: {
  latestOpportunities: OpportunityForCardList[];
}) => {
  const { lang, dir, t } = useLanguage();

  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden" dir={dir}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary">
            {t("opps.title", "آخر الفرص التطوعية")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "opps.subtitle",
              "اكتشف أحدث الفرص التطوعية وكن جزءاً من التغيير الإيجابي في مجتمعنا"
            )}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {latestOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <LatestOpportunityCard opportunity={opportunity} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/opportunities">
            <Button
              variant="default"
              size="lg"
              className="text-white bg-primary hover:bg-primary/90 text-base px-7 py-5 rounded-xl font-bold transition-all duration-300 group shadow-md"
            >
              <span>{t("opps.viewAll", "عرض جميع الفرص التطوعية")}</span>
              {dir === "rtl" ? (
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestOpportunitiesSection;
