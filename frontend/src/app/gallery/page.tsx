import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Film, Image as ImageIcon, Video, Sparkles, MapPin, ArrowRight, ShieldCheck, HeartHandshake, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaGallery from "@/components/landing/media-gallery";
import { getVideos } from "@/data/Videos";
import { getAnnouncements } from "@/data/Announcements";

export const metadata: Metadata = {
  title: "معرض الصور والفيديوهات | منصة لنتطوع",
  description: "المعرض الرقمي الوطني لتوثيق مبادرات ونشاطات التطوع والعمل الخيري في الجزائر بالصوت والصورة عبر كافة الولايات.",
};

// Helper for safe data fetching
async function safeFetch<T extends { status?: number; data?: any }>(
  fetchFn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  try {
    const res = await fetchFn();
    if (res && typeof res.status === 'number' && res.status >= 400) {
      return defaultValue;
    }
    return res;
  } catch (error) {
    console.error("Gallery safeFetch error:", error);
    return defaultValue;
  }
}

export default async function GalleryPage() {
  const [videosResult, announcementsResult] = await Promise.all([
    safeFetch(() => getVideos(), { data: [], status: 500 }),
    safeFetch(() => getAnnouncements(), { data: [], status: 500 }),
  ]);

  const announcementsList = Array.isArray(announcementsResult?.data) ? announcementsResult.data : [];
  const videosList = Array.isArray(videosResult?.data) ? videosResult.data : [];

  const annoncesImages = announcementsList.map((a: any) => a?.image_url).filter(Boolean);
  const videoUrls = videosList.map((v: any) => v?.video_url).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-b from-[#0e4840] via-[#09352f] to-[#062420] text-white pt-16 pb-24 overflow-hidden border-b border-emerald-950/40">
        {/* Subtle decorative background patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#17B2A8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#17B2A8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-white/70 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-[#17B2A8]">معرض الصور والفيديو</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#17B2A8] text-xs font-bold shadow-sm">
              <Film className="w-4 h-4" />
              <span>الأرشيف السمعي البصري الوطني للعمل التطوعي</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              معرض الصور{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#17B2A8] to-emerald-300">
                والفيديوهات الميدانية
              </span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              نافذة حية توثّق إنجازات وتضحيات المتطوعين والجمعيات الشريكة في كافة ربوع الجزائر. استكشف بالصوت والصورة كيف تصنع أيادي العطاء فارقاً ملموساً في الميدان.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-[#17B2A8]">58</div>
                <div className="text-[11px] text-white/70 mt-0.5">ولاية مغطاة ميدانياً</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">+1,200</div>
                <div className="text-[11px] text-white/70 mt-0.5">صورة توثيقية معتمدة</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-teal-300">+450</div>
                <div className="text-[11px] text-white/70 mt-0.5">ساعة توثيق فيديو HD</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-[#17B2A8]">100%</div>
                <div className="text-[11px] text-white/70 mt-0.5">موثوقية ومصداقية ميدانية</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Gallery */}
      <div className="-mt-10 relative z-20">
        <MediaGallery
          annoncesImages={annoncesImages}
          videoUrls={videoUrls}
          rawVideos={videosList}
          rawAnnouncements={announcementsList}
        />
      </div>

      {/* Contribution & Upload CTA for Associations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-primary to-[#0f4d43] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-white">
              <UploadCloud className="w-4 h-4 text-[#17B2A8]" />
              <span>مساهمة الجمعيات والمتطوعين</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              هل لديكم صور أو فيديوهات لتوثيق نشاطكم الخيري؟
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              إذا كنتم جمعية مسجلة أو فريقاً تطوعياً معتمداً وقمتهم بمبادرة ميدانية، يمكنكم مشاركة التوثيق لإبرازه في المعرض الوطني ودعم ثقافة التكافل والتشجير والإغاثة.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/contact">
                <Button className="bg-[#17B2A8] hover:bg-[#17B2A8]/90 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg">
                  تواصل معنا لإرسال المواد التوثيقية
                </Button>
              </Link>
              <Link href="/opportunities">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold px-5 py-2.5 rounded-xl">
                  استكشف الفرص التطوعية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
