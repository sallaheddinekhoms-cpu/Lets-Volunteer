"use client"

import type { ParticipationForVolunteer } from "@/types/participation"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "../ui/button"
import { toast } from "react-toastify"
import { cancelParticipation, participationStats } from "@/data/Participations"
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

  const handleSubmitFeedback = () => {

    const feedbackData = {
      volunteer_feedback: feedback,
    }
    toast.promise(
      participationStats(feedbackData, Number(participation.id)),
      {
        pending: "جاري إرسال التقييم",
        success: "تم إرسال التقييم بنجاح",
        error: "حدث خطأ أثناء إرسال التقييم"
      }
    ).then(() => {
      setFeedback("")
    setIsStatsOpen(false)
    });


    
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
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">ساعات العمل</h3>
                    <p className="text-2xl font-bold text-blue-900">{participation.hours_worked} ساعة</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">التقييم</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-900">{participation.rating}</span>
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= Math.floor(participation?.rating ?? 0) ? "text-yellow-500" : "text-gray-300"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">تعليق المنظمة</h3>
                    <p className="text-purple-900">{participation.organization_feedback}</p>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-medium mb-2">أضف تقييمك للفرصة التطوعية</h3>
                    <Textarea
                      placeholder="شاركنا تجربتك مع هذه الفرصة التطوعية..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start gap-2">
                  <Button type="button" variant="secondary" onClick={() => setIsStatsOpen(false)}>
                    إغلاق
                  </Button>
                  <Button className="text-white" type="button" onClick={handleSubmitFeedback}>
                    إرسال التقييم
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
