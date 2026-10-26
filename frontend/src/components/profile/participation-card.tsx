"use client"

import type { ParticipationForVolunteer } from "@/types/participation"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "../ui/button"
import { toast } from "react-toastify"
import { cancelParticipation, participationStats, rateOrganizationAsVolunteer } from "@/data/Participations"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  XCircle,
  AlertCircle,
  BarChart,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import DownloadCertificateButton from "@/components/certificates/download-certificate-button"

export const statusConfig = {
  accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "مقبول" },
  done: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "منجز" },
  refused: { color: "bg-red-100 text-red-800", icon: XCircle, label: "مرفوض" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "قيد الانتظار" },
}

// Default fallback status for when status is not found
const defaultStatus = { color: "bg-gray-100 text-gray-800", icon: AlertTriangle, label: "غير معروف" }

interface ParticipationCardProps {
  participation: ParticipationForVolunteer
}

const ParticipationCard: React.FC<ParticipationCardProps> = ({ participation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState(participation.volunteer_feedback || "")
  const [orgRating, setOrgRating] = useState<number>(participation.volunteer_org_rating || 5)
  const [isStatsOpen, setIsStatsOpen] = useState(false)

 
  // Use the status from config or fallback to default if not found
  const status =
    participation.status && statusConfig[participation.status] ? statusConfig[participation.status] : defaultStatus

  const handleCancel = async (id: string) => {
    setIsLoading(true)
    try {
      await toast.promise(cancelParticipation(id), {
        pending: "جاري إلغاء المشاركة...",
        success: "تم إلغاء المشاركة بنجاح",
        error: "حدث خطأ أثناء إلغاء المشاركة",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitFeedback = async () => {
    try {
      await toast.promise(
        rateOrganizationAsVolunteer(participation.id, orgRating, feedback),
        {
          pending: "جاري تسجيل تقييمك للجمعية...",
          success: "شكراً لك! تم تسجيل تقييمك بنجاح والمساهمة في مؤشر تميز الجمعية.",
          error: "حدث خطأ أثناء إرسال التقييم"
        }
      )
      setIsStatsOpen(false)
    } catch (e: any) {
      toast.error(e?.message || "حدث خطأ أثناء حفظ التقييم")
    }
  }

  return (
    <motion.div
      key={participation.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-white border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/opportunities/${participation.opportunity.id}`}
              className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
            >
              {participation.opportunity.title}
            </Link>
            <Badge className={`${status.color} flex items-center gap-1 whitespace-nowrap px-2 py-1 rounded-full`}>
              <status.icon className="w-3.5 h-3.5" />
              <span>{status.label}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-4 py-2 flex-grow">
          <div className="flex items-center gap-1 mb-3 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary/70" />
            <p className="text-sm truncate">
              {participation.opportunity.organization?.organization_name || "منظمة غير معروفة"}
            </p>
          </div>

          {participation.opportunity.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{participation.opportunity.description}</p>
          )}

          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary/70" />
            <p className="text-xs">
              {participation.opportunity.created_at
                ? new Date(participation.opportunity.created_at).toLocaleDateString("ar")
                : "تاريخ غير متاح"}
            </p>
          </div>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t border-primary/10 flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/opportunities/${participation.opportunity.id}`}
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  عرض التفاصيل
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>عرض تفاصيل الفرصة التطوعية</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {participation.status === "done" ? (
            <div className="flex items-center gap-2">
            {participation.certificate && (
              <DownloadCertificateButton
                certificateId={participation.certificate.id}
                label="الشهادة"
                size="sm"
                className="text-xs h-8 px-3 gap-1 text-white"
              />
            )}
            <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                >
                  <BarChart className="w-3.5 h-3.5 mr-1" />
                  احصائيات
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">إحصائيات المشاركة</DialogTitle>
                  <DialogDescription className="text-right">
                    تفاصيل مشاركتك في فرصة {participation.opportunity.title}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Total Impact Credit Banner */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs text-emerald-100 font-medium">الرصيد المعتمد لهذه المشاركة:</p>
                      <p className="text-2xl font-black mt-0.5">
                        {participation.calculated_credit_hours || ((participation.hours_worked || 4) * 1.5)}{" "}
                        <span className="text-sm font-normal">ساعة أثر</span>
                      </p>
                    </div>
                    <Sparkles className="w-8 h-8 text-amber-300" />
                  </div>

                  {/* Valuation Breakdown Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                      <span className="text-emerald-800 font-bold block mb-1">الجهد الميداني (x1.5)</span>
                      <p className="font-extrabold text-emerald-950 text-sm">
                        {(participation.hours_worked || 4) * 1.5} س{" "}
                        <span className="text-[10px] text-gray-500 font-normal">({participation.hours_worked || 4}س عمل)</span>
                      </p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg">
                      <span className="text-indigo-800 font-bold block mb-1">المهارة والتخصص</span>
                      <p className="font-extrabold text-indigo-950 text-xs">
                        {participation.skill_level === 'lead' ? 'مؤطر فني (+3س)' : participation.skill_level === 'specialist' ? 'منفذ فني متخصص (+2س)' : 'مساهم عام (1.0x)'}
                      </p>
                    </div>
                  </div>

                  {/* Logistics Badges */}
                  {(participation.provided_transport || participation.provided_equipment || participation.provided_donation) && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs space-y-1">
                      <span className="text-amber-900 font-bold block">مساهمات لوجستية موثقة:</span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {participation.provided_transport && <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px]">توفير وسيلة نقل (+3س)</span>}
                        {participation.provided_equipment && <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px]">توفير عتاد وأدوات (+2س)</span>}
                        {participation.provided_donation && <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px]">مساهمة عينية أو تمويل (+3س)</span>}
                      </div>
                    </div>
                  )}

                  {/* Organization Rating to Volunteer */}
                  {participation.organization_feedback && (
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-xs">
                      <span className="font-bold text-purple-900 block mb-1">شهادة الجمعية حول أدائك:</span>
                      <p className="text-purple-950">{participation.organization_feedback}</p>
                    </div>
                  )}

                  {/* Volunteer Rate Organization Section */}
                  <div className="pt-2 border-t border-gray-200 space-y-2">
                    <label className="text-xs font-bold text-gray-800 block">
                      تقييمك للجمعية المنظمة والتأطير الميداني (مؤشر التميز الجمعوي):
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setOrgRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${orgRating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="شاركنا رأيك حول حسن الاستقبال، التأطير والسلامة الميدانية لمساعدة الجمعية على التطور..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[75px] text-xs"
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start gap-2">
                  <Button type="button" variant="secondary" onClick={() => setIsStatsOpen(false)}>
                    إغلاق
                  </Button>
                  <Button className="text-white bg-emerald-600 hover:bg-emerald-700" type="button" onClick={handleSubmitFeedback}>
                    إرسال التقييم للجمعية
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          ) : (
            <Button
              onClick={() => handleCancel(participation.id)}
              variant="destructive"
              size="sm"
              disabled={isLoading}
              className="text-xs h-8 px-3"
            >
              {isLoading ? "جاري الإلغاء..." : "إلغاء المشاركة"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ParticipationCard
