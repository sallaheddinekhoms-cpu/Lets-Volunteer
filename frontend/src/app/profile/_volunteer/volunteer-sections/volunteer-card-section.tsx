"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Phone,
  Droplet,
  CalendarDays,
  FileImage,
  FileArchive,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Wrench,
  Truck,
  Heart,
  TrendingUp,
} from "lucide-react"
import type { Volunteer, VolunteerStats } from "@/types"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface VolunteerCardSectionProps {
  volunteer: Volunteer
  stats: VolunteerStats
}

const VolunteerCardSection: React.FC<VolunteerCardSectionProps> = ({ volunteer, stats }) => {
  const {
    id,
    avatar,
    first_name,
    last_name,
    phone_number,
    wilaya,
    daira,
    date_of_birth,
    blood_group,
    credit_summary,
  } = volunteer

  const cardRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Use the comprehensive credit summary from impact valuation system
  const totalHours = credit_summary?.total_hours ?? (stats?.total_hours || 0)
  const rankTitle = credit_summary?.rank_ar || "متطوع مبادر"
  const rankColor = credit_summary?.rank_color || "#059669"
  const progressPercent = credit_summary?.progress_to_next || 15
  const nextTarget = credit_summary?.next_target || 25

  const nationalId = `DZ-VOL-2026-${String(id || 1001).padStart(5, "0")}`

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير محدد"
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleExportAsJPEG = async () => {
    if (!cardRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      })
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const link = document.createElement("a")
      link.href = imgData
      link.download = `بطاقة_المتطوع_${first_name}_${last_name}.jpg`
      link.click()
    } catch (error) {
      console.error("Error exporting as JPEG:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportAsPDF = async () => {
    if (!cardRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      })
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
      })
      const width = pdf.internal.pageSize.getWidth()
      const height = (canvas.height * width) / canvas.width
      pdf.addImage(imgData, "JPEG", 0, 0, width, height)
      pdf.save(`بطاقة_المتطوع_${first_name}_${last_name}.pdf`)
    } catch (error) {
      console.error("Error exporting as PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6" dir="rtl">
      {/* Official Header Announcement */}
      <div className="text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          البطاقة الوطنية الرقمية للمتطوع الجزائري - معتمدة رسمياً
        </div>
        <p className="text-xs text-muted-foreground">
          وثيقة رسمية رقمية تثبت قيدك في السجل الوطني للعمل التطوعي وتوثق رصيد الأثر والساعات المعتمدة
        </p>
      </div>

      {/* Official Badge Card */}
      <div ref={cardRef} className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl overflow-hidden border-2 border-[#006D5B] bg-gradient-to-b from-white to-emerald-50/30 rounded-2xl relative">
          {/* Top National Republic Header Banner */}
          <div className="bg-gradient-to-r from-[#004D40] via-[#006D5B] to-[#004D40] text-white pt-4 pb-3 px-5 text-center relative border-b-2 border-amber-400">
            <p className="text-[10px] font-bold tracking-wider text-emerald-100">
              الجمهورية الجزائرية الديمقراطية الشعبية
            </p>
            <h3 className="text-sm font-extrabold tracking-wide mt-0.5 text-white">
              المنصة الوطنية للعمل التطوعي « لنتطوع »
            </h3>
            <p className="text-[9px] text-amber-300 font-semibold mt-0.5">
              CARTE NATIONALE DU BÉNÉVOLE • NATIONAL VOLUNTEER ID
            </p>

            {/* National ID Pill */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-emerald-950 px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest shadow-md">
              {nationalId}
            </div>
          </div>

          <div className="px-5 pt-7 pb-5 space-y-4">
            {/* Avatar & Identification Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-[#006D5B] shadow-md bg-background shrink-0">
                {avatar ? (
                  <AvatarImage
                    src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
                  />
                ) : (
                  <AvatarFallback className="text-xl font-bold bg-[#006D5B] text-white">
                    {first_name?.charAt(0)}
                    {last_name?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-black text-foreground">
                    {first_name} {last_name}
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                
                {/* Certified Rank Badge */}
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: `${rankColor}15`, color: rankColor, borderColor: `${rankColor}40` }}
                    className="text-[11px] font-black px-2 py-0.5 rounded-md border"
                  >
                    ★ {rankTitle}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>{totalHours} ساعة أثر معتمدة</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
              <div className="p-2 bg-white/70 dark:bg-card rounded-lg border border-border/50 space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> الولاية والدائرة
                </span>
                <p className="font-bold text-foreground">
                  {wilaya || "الجزائر"} {daira ? `• ${daira}` : ""}
                </p>
              </div>

              <div className="p-2 bg-white/70 dark:bg-card rounded-lg border border-border/50 space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-red-500" /> فصيلة الدم (طوارئ)
                </span>
                <p className="font-black text-red-600 dark:text-red-400 text-sm">
                  {blood_group || "O+"}
                </p>
              </div>

              <div className="p-2 bg-white/70 dark:bg-card rounded-lg border border-border/50 space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3 text-primary" /> الهاتف المسجل
                </span>
                <p dir="ltr" className="font-bold text-foreground text-right">
                  {phone_number || "0555000000"}
                </p>
              </div>

              <div className="p-2 bg-white/70 dark:bg-card rounded-lg border border-border/50 space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3 text-primary" /> تاريخ الميلاد
                </span>
                <p className="font-bold text-foreground">{formatDate(date_of_birth)}</p>
              </div>
            </div>

            {/* Bottom Official Stamp & Verification QR */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <div className="border border-emerald-600/30 rounded-lg p-1.5 bg-emerald-500/5 text-center flex-1 ml-3">
                <p className="text-[8px] font-bold text-emerald-800 dark:text-emerald-300">
                  الختم الإلكتروني المعتمد • ONSC / CSJ
                </p>
                <p className="text-[7px] text-muted-foreground">
                  مطابق لميثاق المتطوع والقانون 12-06
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 p-1 bg-white rounded-lg border border-border shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://lets-volunteer.dz/verify/${nationalId}`}
                  alt="QR Verification"
                  className="w-12 h-12"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Impact Breakdown Matrix Card */}
      <div className="w-full max-w-xl mx-auto bg-card border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-sm text-foreground">تفصيل رصيد الأثر التطوعي المعتمد</h4>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
            الإجمالي: {totalHours} ساعة
          </span>
        </div>

        {/* Progress bar towards next rank */}
        <div className="space-y-1.5 bg-muted/40 p-3 rounded-xl border border-border/50">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" /> التقدم نحو الرتبة التالية ({nextTarget} ساعة)
            </span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 5 Impact Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-right">
            <div className="flex items-center gap-1 text-emerald-800 text-[11px] font-bold mb-1">
              <Award className="w-3.5 h-3.5" /> الجهد الميداني (x1.5)
            </div>
            <p className="text-lg font-black text-emerald-900">{credit_summary?.fieldwork_hours ?? (stats?.total_hours || 0)} <span className="text-xs font-normal">س</span></p>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl text-right">
            <div className="flex items-center gap-1 text-teal-800 text-[11px] font-bold mb-1">
              <GraduationCap className="w-3.5 h-3.5" /> ساعات التكوين
            </div>
            <p className="text-lg font-black text-teal-900">{credit_summary?.training_hours ?? 0} <span className="text-xs font-normal">س</span></p>
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-xl text-right">
            <div className="flex items-center gap-1 text-indigo-800 text-[11px] font-bold mb-1">
              <Wrench className="w-3.5 h-3.5" /> المهارة والتخصص
            </div>
            <p className="text-lg font-black text-indigo-900">{credit_summary?.skill_hours ?? 0} <span className="text-xs font-normal">س</span></p>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-right">
            <div className="flex items-center gap-1 text-amber-800 text-[11px] font-bold mb-1">
              <Truck className="w-3.5 h-3.5" /> الدعم اللوجستي
            </div>
            <p className="text-lg font-black text-amber-900">{credit_summary?.logistics_hours ?? 0} <span className="text-xs font-normal">س</span></p>
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-right sm:col-span-2">
            <div className="flex items-center gap-1 text-rose-800 text-[11px] font-bold mb-1">
              <Heart className="w-3.5 h-3.5" /> حوافز الوفاء والانطلاقة
            </div>
            <p className="text-lg font-black text-rose-900">{credit_summary?.milestone_hours ?? 0} <span className="text-xs font-normal">س</span></p>
          </div>
        </div>
      </div>

      {/* Export & Print Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleExportAsPDF}
          className="bg-[#006D5B] hover:bg-[#004D40] text-white gap-2 font-bold px-5 py-2.5 rounded-xl shadow-md"
          disabled={isExporting}
        >
          <FileArchive className="h-4 w-4 text-amber-300" />
          <span>طباعة كـ PDF رسمي</span>
        </Button>

        <Button
          onClick={handleExportAsJPEG}
          variant="outline"
          className="border-[#006D5B]/30 text-[#006D5B] hover:bg-[#006D5B]/10 gap-2 font-bold px-5 py-2.5 rounded-xl shadow-xs"
          disabled={isExporting}
        >
          <FileImage className="h-4 w-4" />
          <span>حفظ صورة البطاقة (JPG)</span>
        </Button>
      </div>
    </div>
  )
}

export default VolunteerCardSection
