"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Building2,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  UserCheck,
  ShieldCheck,
  Globe,
  Facebook,
  Instagram,
  Phone,
  Landmark,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import algerianWilayas from "algeria-wilayas"
import Link from "next/link"

interface OrganizationItem {
  id: string
  organization_name: string
  description?: string
  wilaya: string
  daira?: string
  phone_number?: string
  website?: string
  facebook?: string
  instagram?: string
  approval_id?: string
  president_name?: string
  approval_date?: string
  is_confirmed: boolean
  impact?: {
    impact_points: number
    tier: string
    tier_label: string
    avg_volunteer_rating: number
    badge_volunteer_friendly: boolean
    badge_training_incubator: boolean
    badge_rapid_response: boolean
    opportunities_completed: number
  }
}

export default function VerifiedOrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWilaya, setSelectedWilaya] = useState("all")

  const wilayas = algerianWilayas.getAllWilayas()

  const defaultMockOrgs: OrganizationItem[] = [
    {
      id: "org-1",
      organization_name: "الهلال الأحمر الجزائري - لجنة ولاية الجزائر",
      description: "منظمة إنسانية تطوعية مستقلة تعمل كجهاز مساعد للسلطات العمومية في المجال الإنساني والصحي والإغاثي.",
      wilaya: "الجزائر",
      daira: "سيدي امحمد",
      phone_number: "021633155",
      approval_id: "DEC-CRA-1962",
      president_name: "ابتسام حملاوي",
      approval_date: "1962-12-11",
      is_confirmed: true,
      website: "https://cra.dz",
    },
    {
      id: "org-2",
      organization_name: "الكشافة الإسلامية الجزائرية (SMA)",
      description: "حركة تربوية تطوعية وطنية تهدف إلى تنمية الشباب فكرياً واجتماعياً وروحياً من خلال العمل الميداني والمخيمات.",
      wilaya: "الجزائر",
      daira: "المدنية",
      phone_number: "023501234",
      approval_id: "MIN-INT-1989/44",
      president_name: "عبد الرحمن حمزاوي",
      approval_date: "1989-11-01",
      is_confirmed: true,
      website: "https://sma-dz.org",
    },
    {
      id: "org-3",
      organization_name: "جمعية البركة للعمل الخيري والإنساني",
      description: "جمعية وطنية مرخصة تعنى بمساعدة الأيتام والأسر المتعففة وتسيير قوافل الإغاثة الطبية والغذائية.",
      wilaya: "البليدة",
      daira: "البليدة",
      phone_number: "025314040",
      approval_id: "MIN-INT-2015/09",
      president_name: "الشيخ أحمد الإبراهيمي",
      approval_date: "2015-05-18",
      is_confirmed: true,
    },
    {
      id: "org-4",
      organization_name: "جمعية أصدقاء المريض والبيئة المستدامة",
      description: "جمعية ولائية تهدف لمرافقة مرضى السرطان وتوفير الأجهزة الطبية المجانية والتوعية البيئية.",
      wilaya: "وهران",
      daira: "وهران",
      phone_number: "041223344",
      approval_id: "WIL-ORAN-2019/112",
      president_name: "د. طارق مرابط",
      approval_date: "2019-03-22",
      is_confirmed: true,
    },
  ]

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/organizations/")
      if (res.ok) {
        const data = await res.json()
        const orgList = data.results || data
        if (Array.isArray(orgList) && orgList.length > 0) {
          setOrganizations(orgList)
        } else {
          setOrganizations(defaultMockOrgs)
        }
      } else {
        setOrganizations(defaultMockOrgs)
      }
    } catch {
      setOrganizations(defaultMockOrgs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.description && org.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (org.approval_id && org.approval_id.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesWilaya = selectedWilaya === "all" || org.wilaya === selectedWilaya
    return matchesSearch && matchesWilaya
  })

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-[#006D5B] to-[#0A3D36] text-white p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold">
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              السجل الوطني المعتمد طبقاً للقانون 12-06
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              دليل الجمعيات والهيئات المعتمدة
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              سجل وطني رسمي يضم الجمعيات والمؤسسات الأهلية المعتمدة قانونياً، بهدف إرساء الشفافية التامة وحماية حقوق المتطوعين وضمان توجيه الطاقات للمبادرات المرخصة.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
              <Input
                placeholder="ابحث باسم الجمعية، أو رقم الاعتماد الوزاري/الولائي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>

            <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية حسب الولاية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الولايات (الـ 58 ولاية)</SelectItem>
                {wilayas.map((w) => (
                  <SelectItem key={w.code} value={w.name.arabic}>
                    {w.name.arabic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Organizations Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">جاري تحميل سجل الهيئات المعتمدة...</div>
        ) : filteredOrgs.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed p-8">
            <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">لا توجد هيئات مطابقة لمعايير البحث</h3>
            <p className="text-sm text-muted-foreground mt-1">تأكد من كتابة الاسم أو رقم الاعتماد بشكل صحيح.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrgs.map((org) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col justify-between border-border/70 hover:border-primary/50 hover:shadow-xl transition-all group overflow-hidden">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          معتمدة رسمياً
                        </Badge>
                        <Badge variant="outline" className="text-teal-800 border-teal-300 bg-teal-50 text-[11px] font-bold">
                          {org.impact?.tier_label || "جمعية نشطة وموثوقة"}
                        </Badge>
                        {org.impact?.badge_volunteer_friendly && (
                          <Badge variant="outline" className="text-blue-800 border-blue-300 bg-blue-50 text-[11px] font-bold">
                            ★ صديقة المتطوعين ({org.impact.avg_volunteer_rating || 5.0})
                          </Badge>
                        )}
                        {org.impact?.badge_training_incubator && (
                          <Badge variant="outline" className="text-purple-800 border-purple-300 bg-purple-50 text-[11px] font-bold">
                            حاضنة التكوين
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {org.wilaya} {org.daira ? `• ${org.daira}` : ""}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {org.organization_name}
                    </h3>

                    {org.approval_id && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-mono font-bold">
                        <span>رقم الاعتماد الرسمي:</span>
                        <span>{org.approval_id}</span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p className="leading-relaxed line-clamp-3">{org.description || "جمعية أهلية تنشط في تأطير المبادرات الاجتماعية والعمل التطوعي في الجزائر."}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border/40">
                      {org.president_name && (
                        <div className="flex items-center gap-1.5 text-foreground/80">
                          <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>الرئيس: {org.president_name}</span>
                        </div>
                      )}

                      {org.approval_date && (
                        <div className="flex items-center gap-1.5 text-foreground/80">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>تاريخ التأسيس: {org.approval_date}</span>
                        </div>
                      )}

                      {org.phone_number && (
                        <div className="flex items-center gap-1.5 text-foreground/80">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span dir="ltr">{org.phone_number}</span>
                        </div>
                      )}

                      {org.website && (
                        <div className="flex items-center gap-1.5 text-primary">
                          <Globe className="w-3.5 h-3.5" />
                          <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            الموقع الرسمي
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/40 bg-muted/20 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      مؤهلة لنشر الفرص التطوعية
                    </span>

                    <Link href={`/opportunities?wilaya=${encodeURIComponent(org.wilaya)}`}>
                      <Button size="sm" variant="outline" className="text-xs font-bold border-primary/30 text-primary hover:bg-primary/10">
                        عرض فرص الجمعية
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
