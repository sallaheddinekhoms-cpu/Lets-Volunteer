"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LifeBuoy,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  HelpCircle,
  MessageSquare,
  FileText,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-toastify"

interface SupportTicketItem {
  id: string
  ticket_number: string
  title: string
  category: string
  priority: string
  status: "open" | "in_progress" | "resolved" | "closed"
  description: string
  created_at: string
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form fields
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("technical")
  const [priority, setPriority] = useState("normal")
  const [description, setDescription] = useState("")

  const defaultMockTickets: SupportTicketItem[] = [
    {
      id: "1",
      ticket_number: "TKT-2026-081",
      title: "استفسار حول اعتماد الشهادة التطوعية من الهيئة",
      category: "استفسار إداري",
      priority: "normal",
      status: "resolved",
      description: "شاركت في حملة تشجير سابقة ولم تظهر الساعات في ملفي الشخصي، تم حل الإشكال وإصدار الشهادة.",
      created_at: "2026-10-18",
    },
    {
      id: "2",
      ticket_number: "TKT-2026-094",
      title: "اقتراح إضافة فرع جديد لمحافظة الغابات",
      category: "اقتراح تطوير",
      priority: "normal",
      status: "in_progress",
      description: "طلب ربط الجمعيات المهتمة بالبيئة مع قطاع الغابات المحلي في ولاية تيزي وزو.",
      created_at: "2026-10-21",
    },
  ]

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      const res = await fetch("http://127.0.0.1:8000/api/tickets/", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setTickets(data)
        } else {
          setTickets(defaultMockTickets)
        }
      } else {
        setTickets(defaultMockTickets)
      }
    } catch {
      setTickets(defaultMockTickets)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error("يرجى إدخال عنوان المشكلة وشرح تفاصيل الشكوى")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        title,
        category,
        priority,
        description,
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      const res = await fetch("http://127.0.0.1:8000/api/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const newTicketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
      const newTicket: SupportTicketItem = {
        id: String(Date.now()),
        ticket_number: newTicketNumber,
        title,
        category:
          category === "technical"
            ? "مشكلة تقنية"
            : category === "violation"
            ? "مخالفة أو بلاغ"
            : category === "administrative"
            ? "استفسار إداري"
            : "اقتراح تطوير",
        priority,
        status: "open",
        description,
        created_at: new Date().toISOString().split("T")[0],
      }

      setTickets([newTicket, ...tickets])
      toast.success(`تم فتح بطاقة الدعم برقم [${newTicketNumber}] بنجاح! سيتم الرد خلال 24 ساعة.`)

      setTitle("")
      setDescription("")
      setCategory("technical")
      setPriority("normal")
    } catch {
      toast.error("حدث خطأ في إرسال البطاقة")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-emerald-600 text-white">تم الحل بنجاح</Badge>
      case "in_progress":
        return <Badge className="bg-amber-600 text-white">قيد المعالجة الإدارية</Badge>
      default:
        return <Badge className="bg-blue-600 text-white">مفتوحة بانتظار المراجعة</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-primary to-[#004D40] text-white p-8 md:p-10 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold">
              <LifeBuoy className="w-3.5 h-3.5 text-amber-300" />
              خدمة المستفيدين والمتطوعين 24/7
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold">نظام التواصل وبطاقات الشكاوى</h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              صوتك مسموع ومحمي. نوفر فضاءً رسمياً لرفع الانشغالات، الإبلاغ عن أي مخالفات، حل الإشكالات التقنية وتقديم الاقتراحات للارتقاء بالعمل التطوعي.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Ticket Submission Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  فتح بطاقة شكوى أو استفسار جديدة
                </CardTitle>
                <CardDescription>
                  املأ البيانات بدقة لمساعدة فريق الدعم في معالجة طلبك بأسرع وقت
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">موضوع التذكرة *</label>
                    <Input
                      placeholder="عنوان موجز يوضح طبيعة الطلب أو الشكوى"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1">نوع الانشغال *</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">مشكلة تقنية في الموقع</SelectItem>
                          <SelectItem value="violation">إبلاغ عن مخالفة هيئة أو سوء معاملة</SelectItem>
                          <SelectItem value="administrative">استفسار إداري أو توثيق ساعات</SelectItem>
                          <SelectItem value="suggestion">اقتراح تحسين للمنصة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">درجة الأهمية *</label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">عادي (خلال 48 ساعة)</SelectItem>
                          <SelectItem value="medium">متوسط (خلال 24 ساعة)</SelectItem>
                          <SelectItem value="urgent">عاجل وطارئ (ميداني)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">شرح وتفاصيل الشكوى *</label>
                    <Textarea
                      placeholder="اشرح المشكلة بالتفصيل، اذكر أسماء الهيئات أو الفرص وتواريخ حدوث الواقعة إن وجدت..."
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white gap-2 font-bold px-6">
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "جاري الإرسال..." : "إرسال التذكرة للمتابعة"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* List of user's active tickets */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                سجل بطاقاتك ومتابعة الردود:
              </h3>

              {tickets.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground bg-card rounded-2xl border border-dashed">
                  لا توجد بطاقات مسجلة لديك حالياً
                </div>
              ) : (
                tickets.map((t) => (
                  <Card key={t.id} className="border-border/60 hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded font-bold text-foreground">
                            {t.ticket_number}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {t.created_at}
                          </span>
                        </div>
                        {getStatusBadge(t.status)}
                      </div>
                      <CardTitle className="text-base font-bold mt-1 text-foreground">
                        {t.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground leading-relaxed">
                      <p>{t.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Direct channels & FAQ */}
          <div className="space-y-6">
            <Card className="border-border/60 bg-linear-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  قنوات التواصل المباشرة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>support@lets-volunteer.dz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>الرقم الأخضر المجاني: 3030</span>
                </div>
                <div className="p-3 bg-card rounded-xl border border-border/60 text-foreground/80 mt-2">
                  <p className="font-semibold text-primary mb-1">ساعات عمل الإدارة:</p>
                  <p>من الأحد إلى الخميس: 08:30 - 16:30</p>
                  <p className="text-muted-foreground mt-0.5">البلاغات العاجلة تعالج آلياً على مدار الساعة.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  ميثاق حماية المتطوع
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  • تلتزم إدارة المنصة بحماية هوية صاحب البلاغ والحفاظ على سرية المعلومات.
                </p>
                <p>
                  • يحق للمتطوع رفض أي مهمة لا تطابق الوصف المعلن أو تشكل خطورة على سلامته.
                </p>
                <p>
                  • تسحب الاعتمادات الرسمية فوراً من أي هيئة يثبت استغلالها للمتطوعين لأغراض تجارية.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
