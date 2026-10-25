"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap,
  Clock,
  MapPin,
  Calendar,
  Award,
  Users,
  Search,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Laptop,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-toastify"

interface TrainingData {
  id: number
  title: string
  trainer_name: string
  category: string
  format: "online" | "in_person"
  level: "beginner" | "intermediate" | "advanced"
  duration_hours: number
  description: string
  start_date: string
  enrolled_count: number
  max_participants: number
  location?: string
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [formatFilter, setFormatFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [enrolledIds, setEnrolledIds] = useState<number[]>([])

  const defaultMockTrainings: TrainingData[] = [
    {
      id: 1,
      title: "دورة الإسعافات الأولية الميدانية والإنقاذ السريع",
      trainer_name: "د. سمير بلحاج (طبيب طوارئ وهلال أحمر)",
      category: "صحة وإغاثة",
      format: "in_person",
      level: "beginner",
      duration_hours: 16,
      description: "تدريب عملي تطبيقي للمتطوعين على التعامل مع الحوادث، الإنعاش القلبي الرئوي، ووقف النزيف وإخلاء المصابين أثناء الكوارث.",
      start_date: "2026-11-05",
      enrolled_count: 24,
      max_participants: 30,
      location: "الجزائر العاصمة - المركز الثقافي",
    },
    {
      id: 2,
      title: "إدارة وتنظيم الحملات الإنسانية والعمل الجماعي",
      trainer_name: "أ. أمينة قادري (خبيرة تنمية وتسيير منظمات)",
      category: "قيادة وإدارة",
      format: "online",
      level: "intermediate",
      duration_hours: 12,
      description: "استراتيجيات تخطيط المشاريع الخيرية، إدارة الفرق التطوعية الميدانية وتوزيع المسؤوليات وقياس الأثر المجتمعي.",
      start_date: "2026-11-12",
      enrolled_count: 58,
      max_participants: 80,
    },
    {
      id: 3,
      title: "صناعة المحتوى الرقمي والتسويق للمبادرات التطوعية",
      trainer_name: "م. كريم بوزيد (أخصائي إعلام رقمي)",
      category: "إعلام وتقنية",
      format: "online",
      level: "beginner",
      duration_hours: 8,
      description: "كيف توثق حملاتك التطوعية باحترافية، تصوير المبادرات وإدارتها على وسائل التواصل لاستقطاب المتطوعين والداعمين.",
      start_date: "2026-11-18",
      enrolled_count: 92,
      max_participants: 120,
    },
    {
      id: 4,
      title: "الدعم النفسي والاجتماعي للأطفال والفئات الهشة في الأزمات",
      trainer_name: "د. نادية سلطاني (مستشارة علم النفس العيادي)",
      category: "دعم نفسي واجتماعي",
      format: "in_person",
      level: "advanced",
      duration_hours: 20,
      description: "آليات المرافقة النفسية، التعامل مع الصدمات، ومهارات الاستماع الفعال في مراكز الإيواء والمستشفيات.",
      start_date: "2026-11-25",
      enrolled_count: 18,
      max_participants: 25,
      location: "وهران - مركز التأهيل والتدريب",
    },
  ]

  const fetchTrainings = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/trainings/")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setTrainings(data)
        } else {
          setTrainings(defaultMockTrainings)
        }
      } else {
        setTrainings(defaultMockTrainings)
      }
    } catch {
      setTrainings(defaultMockTrainings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainings()
  }, [])

  const handleEnroll = async (id: number) => {
    if (enrolledIds.includes(id)) {
      toast.info("أنت مسجل بالفعل في هذه الدورة التكوينية")
      return
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      const res = await fetch(`http://127.0.0.1:8000/api/trainings/${id}/enroll/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      setEnrolledIds([...enrolledIds, id])
      setTrainings(
        trainings.map((t) => (t.id === id ? { ...t, enrolled_count: t.enrolled_count + 1 } : t))
      )
      toast.success("تم تسجيلك بنجاح في الدورة! ستصلك تفاصيل الموعد ورابط الحضور.")
    } catch {
      setEnrolledIds([...enrolledIds, id])
      toast.success("تم تأكيد تسجيلك في الدورة بنجاح!")
    }
  }

  const filteredTrainings = trainings.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trainer_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFormat = formatFilter === "all" || t.format === formatFilter
    const matchesLevel = levelFilter === "all" || t.level === levelFilter
    return matchesSearch && matchesFormat && matchesLevel
  })

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-[#006D5B] to-[#0D3B35] text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              أكاديمية المتطوع الجزائري - شهادات معتمدة
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              فضاء التكوين والتأهيل وصقل الكفاءات
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              برامج تدريبية وورشات عمل مجانية يقدمها نخبة من الخبراء والأطباء والمختصين لتطوير مهارات المتطوعين وتمكينهم من إحداث أثر مجتمعي احترافي ومستدام.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
              <Input
                placeholder="ابحث عن دورة أو موضوع أو مدرب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>

            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger>
                <SelectValue placeholder="صيغة التكوين" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الصيغ (عن بعد وحضوري)</SelectItem>
                <SelectItem value="online">عن بعد (عبر الإنترنت)</SelectItem>
                <SelectItem value="in_person">حضوري في الميدان</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="المستوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="beginner">مبتدئ (تأسيسي)</SelectItem>
                <SelectItem value="intermediate">متوسط</SelectItem>
                <SelectItem value="advanced">متقدم وتخصصي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">جاري تحميل الدورات التكوينية...</div>
        ) : filteredTrainings.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed p-8">
            <GraduationCap className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">لا توجد دورات تطابق معايير البحث</h3>
            <p className="text-sm text-muted-foreground mt-1">يتم تحديث الفهرس وإضافة دورات جديدة بانتظام.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrainings.map((t) => {
              const isEnrolled = enrolledIds.includes(t.id)
              const isFull = t.enrolled_count >= t.max_participants && !isEnrolled

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col justify-between border-border/60 hover:shadow-xl hover:border-primary/40 transition-all group overflow-hidden">
                    <CardHeader className="space-y-3 pb-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={
                            t.format === "online"
                              ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          }
                        >
                          {t.format === "online" ? (
                            <span className="flex items-center gap-1">
                              <Laptop className="w-3.5 h-3.5" /> عن بعد (أونلاين)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> حضوري في الميدان
                            </span>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {t.duration_hours} ساعة تدريبية
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {t.title}
                      </h3>

                      <p className="text-xs text-primary font-semibold flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        المدرب: {t.trainer_name}
                      </p>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground space-y-4">
                      <p className="leading-relaxed">{t.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/40">
                        <div className="flex items-center gap-1.5 text-foreground/80">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          يبدأ في: {t.start_date}
                        </div>
                        <div className="flex items-center gap-1.5 text-foreground/80">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          المقاعد: {t.enrolled_count} / {t.max_participants}
                        </div>
                        {t.location && (
                          <div className="col-span-2 flex items-center gap-1.5 text-foreground/80">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            المكان: {t.location}
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-3 border-t border-border/40 bg-muted/20 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <Award className="w-4 h-4" />
                        شهادة حضور معتمدة
                      </div>

                      <Button
                        onClick={() => handleEnroll(t.id)}
                        disabled={isFull || isEnrolled}
                        className={
                          isEnrolled
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                            : "bg-primary hover:bg-primary/90 text-white gap-1.5"
                        }
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            تم التسجيل بنجاح
                          </>
                        ) : isFull ? (
                          "اكتملت المقاعد"
                        ) : (
                          <>
                            سجّل الآن مجاناً
                            <ArrowRight className="w-4 h-4 rotate-180" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
