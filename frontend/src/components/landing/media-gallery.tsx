"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Image as ImageIcon, X, MapPin, Calendar, Film, Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export interface MediaItem {
  id: string;
  type: "photo" | "video";
  title: string;
  category: string;
  wilaya: string;
  date: string;
  mediaUrl: string;
  thumbnailUrl: string;
  description: string;
}

interface MediaGalleryProps {
  annoncesImages?: string[];
  videoUrls?: string[];
  rawVideos?: any[];
  rawAnnouncements?: any[];
}

export default function MediaGallery({
  annoncesImages = [],
  videoUrls = [],
  rawVideos = [],
  rawAnnouncements = [],
}: MediaGalleryProps) {
  const { lang, dir, t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  // Combine provided images/videos with structured gallery items
  const baseItems: MediaItem[] = [
    {
      id: "media-1",
      type: "video",
      title: "التوثيق الميداني لحملات التشجير وإعادة تأهيل الغابات",
      category: "بيئة وتشجير",
      wilaya: "الجلفة",
      date: "أكتوبر 2026",
      mediaUrl: videoUrls[0] || "/videos/t.mp4",
      thumbnailUrl: annoncesImages[0] || "/annonces/annonce1.jpg",
      description: "مقتطفات حية من هبة الشباب الجزائري لغرس آلاف الشجيرات ضمن مبادرة السد الأخضر.",
    },
    {
      id: "media-2",
      type: "photo",
      title: "قافلة التبرع بالدم التضامنية الكبرى",
      category: "صحة وإسعاف",
      wilaya: "الجزائر",
      date: "سبتمبر 2026",
      mediaUrl: annoncesImages[0] || "/annonces/annonce1.jpg",
      thumbnailUrl: annoncesImages[0] || "/annonces/annonce1.jpg",
      description: "تنظيم محكم واستجابة قياسية للمتطوعين لدعم مراكز حقن الدم في المستشفيات الجامعية.",
    },
    {
      id: "media-3",
      type: "video",
      title: "ورشة التكوين الميداني في الإسعافات الأولية",
      category: "فضاء التكوين",
      wilaya: "سطيف",
      date: "أوت 2026",
      mediaUrl: videoUrls[1] || videoUrls[0] || "/videos/WhatsApp Video 2025-12-29 at 22.06.32.mp4",
      thumbnailUrl: "/annonces/annonce1.jpg",
      description: "تأهيل الدفعة الأولى من المتطوعين المسعفين على تقنيات الإنعاش الرئوي والتدخل السريع.",
    },
    {
      id: "media-4",
      type: "photo",
      title: "توزيع الطرود المدرسية والمستلزمات على القرى النائية",
      category: "تضامن وتكافل",
      wilaya: "تيزي وزو",
      date: "سبتمبر 2026",
      mediaUrl: annoncesImages[1] || annoncesImages[0] || "/annonces/annonce1.jpg",
      thumbnailUrl: annoncesImages[1] || annoncesImages[0] || "/annonces/annonce1.jpg",
      description: "ابتسامات أطفال المدارس في المناطق الجبلية مع انطلاق الموسم الدراسي الجديد.",
    },
    {
      id: "media-5",
      type: "photo",
      title: "مبادرة تنظيف الشواطئ والمحميات الطبيعية",
      category: "بيئة ومناخ",
      wilaya: "وهران",
      date: "جويلية 2026",
      mediaUrl: annoncesImages[0] || "/annonces/annonce1.jpg",
      thumbnailUrl: annoncesImages[0] || "/annonces/annonce1.jpg",
      description: "حملة شبابية واسعة لرفع الوعي وحماية الثروة البحرية والساحل الجزائري.",
    },
    {
      id: "media-6",
      type: "video",
      title: "رسالة فخر: تجارب ملهمة لشباب متطوعين",
      category: "قصص نجاح",
      wilaya: "قسنطينة",
      date: "جوان 2026",
      mediaUrl: videoUrls[0] || "/videos/t.mp4",
      thumbnailUrl: annoncesImages[0] || "/annonces/annonce1.jpg",
      description: "شهادات حية من متطوعي المنصة حول أثر العمل الخيري في بناء شخصياتهم ومسارهم المهني.",
    },
  ];

  // Dynamic videos from database
  const dynamicVideos: MediaItem[] = (rawVideos || []).map((v, idx) => ({
    id: `db-video-${v.id || idx}`,
    type: "video" as const,
    title: v.title || "توثيق ميداني",
    category: "فيديو توثيقي",
    wilaya: "الجزائر",
    date: "2026",
    mediaUrl: v.video_url,
    thumbnailUrl: annoncesImages[0] || "/annonces/annonce1.jpg",
    description: v.description || "فيديو توثيقي لنشاط تطوعي وميداني مسجل في المنصة.",
  }));

  // Dynamic announcements / photos from database
  const dynamicPhotos: MediaItem[] = (rawAnnouncements || []).map((a, idx) => ({
    id: `db-photo-${a.id || idx}`,
    type: "photo" as const,
    title: a.title || "لقطة ميدانية",
    category: "صور المبادرات",
    wilaya: "الجزائر",
    date: "2026",
    mediaUrl: a.image_url,
    thumbnailUrl: a.image_url,
    description: a.description || "صورة من النشاطات والفعاليات الميدانية للجمعيات والمتطوعين.",
  }));

  const galleryItems: MediaItem[] = [
    ...dynamicVideos,
    ...dynamicPhotos,
    ...baseItems,
  ].filter((item, index, self) => 
    index === self.findIndex((t) => t.mediaUrl === item.mediaUrl && t.type === item.type)
  );

  const filteredItems = galleryItems.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <section id="gallery" className="py-20 bg-slate-50/70 border-y border-border/60 scroll-mt-20" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Film className="w-3.5 h-3.5" />
              <span>{t("gallery.badge", "معرض الصور والفيديوهات")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {t("gallery.title", "توثيق حي لأثر ")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#17B2A8]">
                {t("gallery.titleHighlight", "مبادراتنا الميدانية")}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              {t("gallery.subtitle", "لحظات حقيقية من عطاء الشباب والجمعيات الشريكة في مختلف ولايات الوطن، موثقة بالصوت والصورة.")}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-border self-start md:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filter === "all"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("gallery.filterAll", "الكل")} ({galleryItems.length})
            </button>
            <button
              onClick={() => setFilter("photo")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filter === "photo"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {t("gallery.filterPhoto", "الصور الميدانية")}
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filter === "video"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              {t("gallery.filterVideo", "الفيديوهات والتوثيق")}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            const isVideo = item.type === "video";
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setActiveItem(item)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-border transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Media Thumbnail Container */}
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} z-10`}>
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-foreground text-[11px] font-bold shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Play / Inspect Icon Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    {isVideo ? (
                      <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#17B2A8] transition-all">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/80 text-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <Eye className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Location & Date Footer on Image */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white/90 text-xs z-10">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#17B2A8]" />
                      <span>{lang === 'ar' ? `ولاية ${item.wilaya}` : `Wilaya of ${item.wilaya}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className={`p-5 flex-1 flex flex-col justify-between ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div>
                    <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                    <span>{isVideo ? t("gallery.watchVideo", "مشاهدة الفيديو الميداني ←") : t("gallery.viewPhoto", "تكبير واستعراض الصورة ←")}</span>
                    <span className="text-[11px] text-muted-foreground">{isVideo ? t("gallery.videoHD", "فيديو عالي الدقة") : t("gallery.photoOriginal", "صورة أصلية")}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Video Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 text-right"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Content */}
              <div className="relative w-full bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
                {activeItem.type === "video" ? (
                  <video
                    src={activeItem.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[65vh] object-contain"
                  />
                ) : (
                  <div className="relative w-full h-[55vh]">
                    <Image
                      src={activeItem.mediaUrl}
                      alt={activeItem.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Modal Info Bar */}
              <div className="p-6 bg-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {activeItem.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mt-2">
                      {activeItem.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      ولاية {activeItem.wilaya}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {activeItem.date}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
