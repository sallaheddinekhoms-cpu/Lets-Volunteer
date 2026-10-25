"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, MapPin, Sparkles, ShieldCheck, HeartHandshake, Award, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const WILAYAS = [
  'الكل', 'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
  'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر',
  'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة',
  'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض',
  'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي',
  'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت',
  'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار', 'أولاد جلال', 'بني عباس',
  'عين صالح', 'عين قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
];

export default function Hero() {
  const router = useRouter();
  const { lang, dir, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("الكل");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedWilaya !== "الكل") params.set("wilaya", selectedWilaya);
    router.push(`/opportunities?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] pt-12 pb-20 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden" dir={dir}>
      {/* Background Glows & Modern Mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#17B2A8]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Content */}
          <motion.div
            className={`lg:col-span-7 space-y-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0, x: dir === 'rtl' ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* National Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#17B2A8] animate-pulse" />
              <span>{t("hero.badge", "المنصة الوطنية للعمل التطوعي في الجزائر 🇩🇿")}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.3]">
              {t("hero.titlePre", "معاً نصنع الأثر.. ونبني مستقبل ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#17B2A8] to-primary">
                {t("hero.titleHighlight", "العمل التطوعي")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
              {t("hero.subtitle", "منصة رقمية موحدة تجمع الشباب والجمعيات لتوثيق الساعات بسجل وطني معتمد، وتبادل التكافل المجتمعي في كافة الـ 58 ولاية.")}
            </p>

            {/* Quick Interactive Search Bar */}
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xl border border-border/80 flex flex-col sm:flex-row items-center gap-2 max-w-2xl"
            >
              <div className="flex-1 flex items-center gap-2 px-3 w-full">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("hero.searchPlaceholder", "ابحث عن فرصة (صحة، تشجير، إغاثة، تكوين)...")}
                  className="w-full text-sm outline-none bg-transparent placeholder:text-muted-foreground/70"
                />
              </div>

              <div className="w-full sm:w-auto h-px sm:h-8 sm:w-px bg-border" />

              <div className="flex items-center gap-2 px-3 w-full sm:w-44">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent text-foreground cursor-pointer font-medium"
                >
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>
                      {w === 'الكل'
                        ? t("hero.allWilayas", "كل الولايات (58)")
                        : `${t("hero.wilayaPrefix", "ولاية")} ${w}`}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-[#105D56]/90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t("hero.searchBtn", "استكشف")}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            {/* Action Buttons & Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/auth">
                <Button className="bg-secondary hover:bg-[#17B2A8]/90 text-white px-6 py-5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all duration-300">
                  <Sparkles className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t("hero.joinVolunteer", "انضم كمتطوع الآن")}
                </Button>
              </Link>
              <Link href="/opportunities">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 px-6 py-5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300">
                  <MapPin className={`w-4 h-4 text-secondary ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t("hero.exploreMap", "خريطة الفرص التفاعلية")}
                </Button>
              </Link>
            </div>

            {/* Micro trust highlights */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t("hero.certifiedHours", "ساعات معتمدة رسمياً")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#17B2A8]" />
                <span>{t("hero.insurance", "تغطية تأمينية ميدانية")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{t("hero.priority", "أولوية في الاستحقاقات الوطنية")}</span>
              </div>
            </div>
          </motion.div>

          {/* Left Column: Real Field Action Collage (الخيار الثالث المختار) */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Glowing Backdrop Mesh */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-[#17B2A8]/20 to-transparent rounded-3xl blur-3xl" />

            <div className="relative">
              
              {/* Main Primary Image */}
              <div className="relative w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <Image
                  src="/hero/volunteers-main.jpg"
                  alt="متطوعون في الميدان"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                {/* Main Image Bottom Caption */}
                <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white z-10">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#17B2A8] text-white text-[10px] font-bold">
                      {lang === 'ar' ? 'نشاط ميداني حي' : 'Live Field Action'}
                    </span>
                    <h4 className="text-sm font-bold mt-1 text-white">
                      {lang === 'ar' ? 'حملات التكافل والتضامن المجتمعي' : 'Community Solidarity Drives'}
                    </h4>
                  </div>
                  <span className="text-[11px] text-white/80 font-medium">
                    {lang === 'ar' ? '58 ولاية 🇩🇿' : '58 Wilayas 🇩🇿'}
                  </span>
                </div>
              </div>

              {/* Overlapping Floating Image 1 (Eco & Tree Planting) */}
              <motion.div
                className="absolute -bottom-8 -left-4 sm:-left-8 w-44 sm:w-52 h-32 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-800"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/hero/tree-planting.jpg"
                  alt="مبادرة السد الأخضر والتشجير"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className={`absolute bottom-2 right-2 left-2 text-white ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <span className="text-[10px] font-bold text-emerald-300">
                    {lang === 'ar' ? '🌲 السد الأخضر والبيئة' : '🌲 Green Dam & Ecology'}
                  </span>
                </div>
              </motion.div>

              {/* Overlapping Floating Image 2 (Health & First Aid) */}
              <motion.div
                className="absolute -top-6 -right-4 sm:-right-8 w-40 sm:w-48 h-28 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-800"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/hero/health-relief.jpg"
                  alt="قوافل الإسعاف والرعاية الصحية"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className={`absolute bottom-2 right-2 left-2 text-white ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <span className="text-[10px] font-bold text-amber-300">
                    {lang === 'ar' ? '🩺 قوافل الإسعاف والصحة' : '🩺 First Aid & Healthcare'}
                  </span>
                </div>
              </motion.div>

              {/* Floating Social Proof Pill (Active Volunteers Count) */}
              <motion.div
                className="absolute top-1/2 -left-6 sm:-left-12 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-border flex items-center gap-3 z-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex -space-x-2 space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    M
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    S
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    K
                  </div>
                </div>
                <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <p className="text-xs font-extrabold text-foreground">
                      +5,230 {lang === 'ar' ? 'متطوع' : 'Volunteers'}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {lang === 'ar' ? 'نشطون في الميدان الآن' : 'Active in the field now'}
                  </p>
                </div>
              </motion.div>

              {/* Floating Verified Hours Ribbon */}
              <motion.div
                className="absolute -bottom-6 right-6 sm:right-10 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-2xl border border-border flex items-center gap-2.5 z-20"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <p className="text-xs font-extrabold text-foreground">
                    14,850+ {lang === 'ar' ? 'ساعة' : 'Hours'}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    {lang === 'ar' ? 'موثقة بالسجل الوطني ✓' : 'Certified in National Register ✓'}
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
