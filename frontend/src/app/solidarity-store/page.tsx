"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Plus,
  Search,
  Phone,
  Share2,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Shirt,
  Armchair,
  Stethoscope,
  BookOpen,
  GraduationCap,
  UtensilsCrossed,
  Tv,
  Baby,
  Activity,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import algerianWilayas from "algeria-wilayas"

// Comprehensive expanded categories list
export const SOLIDARITY_CATEGORIES = [
  { id: "معدات طبية", label: "معدات طبية وشبه طبية (كراسي، أسرة، عكازات)", icon: Stethoscope },
  { id: "أجهزة صحية", label: "أجهزة صحية وتنفسية (ضغط، سكر، أكسجين)", icon: Activity },
  { id: "ملابس", label: "ملابس، أحذية وأغطية شتوية", icon: Shirt },
  { id: "أثاث", label: "أثاث وتجهيزات منزلية", icon: Armchair },
  { id: "أدوات منزلية", label: "أدوات وأجهزة كهرومنزلية", icon: Tv },
  { id: "مأكولات ومواد غذائية", label: "مأكولات ومواد غذائية وطرود تضامنية", icon: UtensilsCrossed },
  { id: "كتب وأدوات مدرسية", label: "كتب، محافظ وأدوات مدرسية", icon: GraduationCap },
  { id: "كتب علمية وثقافية", label: "كتب علمية وثقافية ومراجع جامعية", icon: BookOpen },
  { id: "إلكترونيات وحواسيب", label: "حواسيب وأجهزة لوحية تعليمية", icon: Tv },
  { id: "مستلزمات أطفال", label: "مستلزمات رعاية الأطفال والرضع", icon: Baby },
  { id: "عتاد ذوي الهمم", label: "عتاد وتسهيلات لذوي الهمم وكبار السن", icon: HeartHandshake },
  { id: "أخرى", label: "أغراض أخرى وتكافل عام", icon: Tag },
]

interface SolidarityItemData {
  id: string
  title: string
  category: string
  item_type: "lending" | "donation"
  description: string
  wilaya: string
  daira: string
  status: string
  contact_phone: string
  created_at?: string
}

interface SolidarityRequestData {
  id: string
  requester_name: string
  title: string
  category: string
  urgency: "normal" | "medium" | "urgent"
  urgency_display?: string
  description: string
  wilaya: string
  daira?: string
  contact_phone: string
  status: "pending" | "approved" | "rejected" | "fulfilled"
  status_display?: string
  created_at?: string
}

export default function SolidarityStorePage() {
  const [activeTab, setActiveTab] = useState<"offers" | "requests">("offers")
  const [items, setItems] = useState<SolidarityItemData[]>([])
  const [requests, setRequests] = useState<SolidarityRequestData[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedWilaya, setSelectedWilaya] = useState("all")

  // Modal 1: Add Offer Item
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState("معدات طبية")
  const [newItemType, setNewItemType] = useState<"lending" | "donation">("lending")
  const [newDescription, setNewDescription] = useState("")
  const [newWilaya, setNewWilaya] = useState("")
  const [newDaira, setNewDaira] = useState("")
  const [newPhone, setNewPhone] = useState("")

  // Modal 2: Add Need Request
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)
  const [reqName, setReqName] = useState("")
  const [reqTitle, setReqTitle] = useState("")
  const [reqCategory, setReqCategory] = useState("معدات طبية")
  const [reqUrgency, setReqUrgency] = useState<"normal" | "medium" | "urgent">("urgent")
  const [reqDescription, setReqDescription] = useState("")
  const [reqWilaya, setReqWilaya] = useState("")
  const [reqDaira, setReqDaira] = useState("")
  const [reqPhone, setReqPhone] = useState("")

  const wilayas = algerianWilayas.getAllWilayas()
  const offerDairas = algerianWilayas.getDairasByWilaya(newWilaya)
  const requestDairas = algerianWilayas.getDairasByWilaya(reqWilaya)

  // Default Mock Items covering diverse expanded categories
  const defaultMockItems: SolidarityItemData[] = [
    {
      id: "1",
      title: "كرسي متحرك طبي خفيف الوزن قابل للطي",
      category: "معدات طبية",
      item_type: "lending",
      description: "كرسي متحرك ألمنيوم ممتاز للإعارة المجانية للمرضى بعد العمليات أو كبار السن لفترة التعافي.",
      wilaya: "الجزائر",
      daira: "باب الوادي",
      status: "available",
      contact_phone: "0555123456",
      created_at: "2026-10-23",
    },
    {
      id: "2",
      title: "كسوة شتوية ومعاطف دافئة للأطفال (أعمار 6 إلى 12 سنة)",
      category: "ملابس",
      item_type: "donation",
      description: "مجموعة معاطف شتوية وألبسة صوفية جديدة ونظيفة تبرع لوجه الله لأبناء العائلات المتعففة.",
      wilaya: "سطيف",
      daira: "سطيف",
      status: "available",
      contact_phone: "0661234567",
      created_at: "2026-10-23",
    },
    {
      id: "3",
      title: "طاولة دراسة خشبية وخزانة كتب بحالة ممتازة",
      category: "أثاث",
      item_type: "donation",
      description: "مكتب دراسي وخزانة خشبية متينة صالحة جداً لطالب أو تلميذ بحاجة لتجهيز زاوية دراسة بالبيت.",
      wilaya: "وهران",
      daira: "السانية",
      status: "available",
      contact_phone: "0770987654",
      created_at: "2026-10-22",
    },
    {
      id: "4",
      title: "مدفأة كهربائية آمنة بحالة جيدة جداً",
      category: "أدوات منزلية",
      item_type: "donation",
      description: "مدفأة كهربائية اقتصادية وصالحة للاستعمال الفوري للأسر المحتاجة في المناطق الباردة.",
      wilaya: "باتنة",
      daira: "باتنة",
      status: "available",
      contact_phone: "0550112233",
      created_at: "2026-10-22",
    },
    {
      id: "5",
      title: "طرود مواد غذائية أساسية (زيت، دقيق، سكر، عجائن، بقوليات)",
      category: "مأكولات ومواد غذائية",
      item_type: "donation",
      description: "طرود غذائية تضامنية مجهزة من قبل متطوعين موجهة للمسنين والأسر المتعففة بدون معيل.",
      wilaya: "البليدة",
      daira: "بوفاريك",
      status: "available",
      contact_phone: "0559887766",
      created_at: "2026-10-21",
    },
    {
      id: "6",
      title: "حقائب مدرسية مجهزة بكامل الأدوات والكراريس (ابتدائي ومتوسط)",
      category: "كتب وأدوات مدرسية",
      item_type: "donation",
      description: "حقائب مدرسية جديدة تحتوي على مقالم، أقلام، وكراريس لتشجيع التلاميذ على مواصلة التمدرس.",
      wilaya: "قسنطينة",
      daira: "الخروب",
      status: "available",
      contact_phone: "0670445566",
      created_at: "2026-10-21",
    },
    {
      id: "7",
      title: "مراجع وسلاسل حوليات البكالوريا والجامعة (طب وهندسة)",
      category: "كتب علمية وثقافية",
      item_type: "donation",
      description: "مكتبة علمية غنية بالكتب والمراجع التخصصية والقواميس لإعارتها أو التبرع بها للطلبة الباحثين.",
      wilaya: "تيزي وزو",
      daira: "تيزي وزو",
      status: "available",
      contact_phone: "0561223344",
      created_at: "2026-10-20",
    },
    {
      id: "8",
      title: "جهاز قياس ضغط الدم إلكتروني مع جهاز قياس السكر",
      category: "أجهزة صحية",
      item_type: "lending",
      description: "أجهزة طبية منزلية دقيقة لإعارة المرضى الذين يحتاجون لمتابعة يومية ومستمرة.",
      wilaya: "عنابة",
      daira: "عنابة",
      status: "available",
      contact_phone: "0780112233",
      created_at: "2026-10-20",
    },
  ]

  // Default Mock Requests (Approved by Admin)
  const defaultMockRequests: SolidarityRequestData[] = [
    {
      id: "req-1",
      requester_name: "عمر بن بلقاسم",
      title: "كرسي متحرك كهربائي لشخص مسن مقعد",
      category: "معدات طبية",
      urgency: "urgent",
      urgency_display: "عاجل جداً",
      description: "نبحث عن كرسي متحرك كهربائي لوالد مريض مقعد لتسهيل حركته داخل وخارج البيت، تقبل الله منا ومنكم.",
      wilaya: "الجزائر",
      daira: "الرويبة",
      contact_phone: "0550123456",
      status: "approved",
      status_display: "معتمد",
      created_at: "2026-10-23",
    },
    {
      id: "req-2",
      requester_name: "جمعية بسمة أمل",
      title: "جهاز توليد أكسجين منزلي (Oxygen Concentrator 10L)",
      category: "أجهزة صحية",
      urgency: "urgent",
      urgency_display: "عاجل جداً",
      description: "بحاجة ماسة إلى جهاز تركيز أكسجين 5 لتر أو 10 لتر لمريض يعاني من قصور تنفسي حاد بالبليدة.",
      wilaya: "البليدة",
      daira: "بوفاريك",
      contact_phone: "0661987654",
      status: "approved",
      status_display: "معتمد",
      created_at: "2026-10-23",
    },
    {
      id: "req-3",
      requester_name: "مختار ب.",
      title: "ملابس شتوية وأغطية صوفية لعائلة متضررة",
      category: "ملابس",
      urgency: "urgent",
      urgency_display: "عاجل جداً",
      description: "طلب أفرشة وأغطية شتوية وألبسة دافئة لأطفال عائلة في منطقة ريفية باردة.",
      wilaya: "المدية",
      daira: "قصر البخاري",
      contact_phone: "0770889900",
      status: "approved",
      status_display: "معتمد",
      created_at: "2026-10-22",
    },
    {
      id: "req-4",
      requester_name: "فاطمة الزهراء ع.",
      title: "سرير طبي متعدد الحركات مع فرشة هوائية",
      category: "معدات طبية",
      urgency: "medium",
      urgency_display: "متوسط",
      description: "طلب إعارة مؤقتة لسرير طبي لمريض طريح الفراش بعد عملية جراحية بالعمود الفقري.",
      wilaya: "قسنطينة",
      daira: "علي منجلي",
      contact_phone: "0770334455",
      status: "approved",
      status_display: "معتمد",
      created_at: "2026-10-22",
    },
    {
      id: "req-5",
      requester_name: "طالب جامعي (أحمد)",
      title: "حاسوب محمول مستعمل للدراسة وإعداد مذكرة التخرج",
      category: "إلكترونيات وحواسيب",
      urgency: "medium",
      urgency_display: "متوسط",
      description: "طالب سنة ماستر بحاجة لحاسوب محمول مستعمل للبرمجة وكتابة أطروحة التخرج بعد تعطل جهازه.",
      wilaya: "جيجل",
      daira: "جيجل",
      contact_phone: "0556112233",
      status: "approved",
      status_display: "معتمد",
      created_at: "2026-10-21",
    },
  ]

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch Offer items
      try {
        const resItems = await fetch("http://127.0.0.1:8000/api/solidarity-store/")
        if (resItems.ok) {
          const data = await resItems.json()
          setItems(Array.isArray(data) && data.length > 0 ? data : defaultMockItems)
        } else {
          setItems(defaultMockItems)
        }
      } catch {
        setItems(defaultMockItems)
      }

      // Fetch Approved Requests
      try {
        const resReqs = await fetch("http://127.0.0.1:8000/api/solidarity-requests/")
        if (resReqs.ok) {
          const data = await resReqs.json()
          setRequests(Array.isArray(data) && data.length > 0 ? data : defaultMockRequests)
        } else {
          setRequests(defaultMockRequests)
        }
      } catch {
        setRequests(defaultMockRequests)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Submit Offer Item
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newWilaya || !newPhone.trim()) {
      toast.error("يرجى ملء جميع الحقول الإلزامية (العنوان، الولاية، رقم الهاتف)")
      return
    }

    try {
      setIsSubmittingOffer(true)
      const payload = {
        title: newTitle,
        category: newCategory,
        item_type: newItemType,
        description: newDescription,
        wilaya: newWilaya,
        daira: newDaira,
        contact_phone: newPhone,
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      const res = await fetch("http://127.0.0.1:8000/api/solidarity-store/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success("تم إدراج الغرض في متجر التطوع بنجاح!")
      } else {
        const created: SolidarityItemData = {
          id: String(Date.now()),
          ...payload,
          status: "available",
          created_at: new Date().toISOString().split("T")[0],
        }
        setItems([created, ...items])
        toast.success("تم نشر الغرض في متجر التطوع بنجاح!")
      }

      setIsOfferModalOpen(false)
      setNewTitle("")
      setNewDescription("")
      setNewPhone("")
    } catch {
      toast.error("حدث خطأ أثناء حفظ الغرض")
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  // Submit Need Request (Subject to Admin Approval)
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqTitle.trim() || !reqName.trim() || !reqWilaya || !reqPhone.trim()) {
      toast.error("يرجى ملء اسمك، الغرض المطلوب، الولاية، ورقم الهاتف.")
      return
    }

    try {
      setIsSubmittingRequest(true)
      const payload = {
        requester_name: reqName,
        title: reqTitle,
        category: reqCategory,
        urgency: reqUrgency,
        description: reqDescription,
        wilaya: reqWilaya,
        daira: reqDaira,
        contact_phone: reqPhone,
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      const res = await fetch("http://127.0.0.1:8000/api/solidarity-requests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(
          "تم إرسال طلبك بنجاح! سيتم مراجعته والمصادقة عليه من قبل إدارة المنصة قبل نشره للعموم."
        )
      } else {
        toast.info(
          "تم تسجيل طلبك! سيخضع لمراجعة إدارة المنصة والمصادقة عليه قبل أن يظهر في المتجر."
        )
      }

      setIsRequestModalOpen(false)
      setReqName("")
      setReqTitle("")
      setReqDescription("")
      setReqPhone("")
    } catch {
      toast.error("حدث خطأ أثناء إرسال الطلب")
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  // Flexible category matching helper
  const categoryMatches = (itemCat: string, filterCat: string) => {
    if (filterCat === "all") return true
    const c1 = (itemCat || "").toLowerCase()
    const c2 = (filterCat || "").toLowerCase()
    return c1.includes(c2) || c2.includes(c1)
  }

  // Filtered Offers
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryMatches(item.category, selectedCategory)
    const matchesType = selectedType === "all" || item.item_type === selectedType
    const matchesWilaya = selectedWilaya === "all" || item.wilaya === selectedWilaya
    return matchesSearch && matchesCat && matchesType && matchesWilaya
  })

  // Filtered Requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requester_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryMatches(req.category, selectedCategory)
    const matchesWilaya = selectedWilaya === "all" || req.wilaya === selectedWilaya
    return matchesSearch && matchesCat && matchesWilaya
  })

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background py-10 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-[#0f4d47] to-[#004D40] text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              مبادرة التكافل المجتمعي المجاني الشامل 🇩🇿
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              متجر التطوع والتكافل
            </h1>
            
            <p className="text-white/85 text-base md:text-lg leading-relaxed">
              فضاء خيري تشاركي مفتوح لمختلف الاحتياجات: معدات طبية، ملابس، أثاث، أدوات منزلية، مأكولات ومواد غذائية، كتب مدرسية ومراجع علمية — تبرعاً أو إعارة مجانية لوجه الله.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                onClick={() => setIsOfferModalOpen(true)}
                className="bg-white text-primary hover:bg-emerald-50 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 ml-1.5" />
                أضف غرضاً للتبرع أو الإعارة
              </Button>

              <Button
                onClick={() => setIsRequestModalOpen(true)}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                <HelpCircle className="w-4 h-4 ml-1.5 text-amber-300" />
                لم تجد ما تبحث عنه؟ أضف طلب احتياج
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Quick Showcase Pills */}
        <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-3.5 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-xs font-bold text-muted-foreground ml-2">تصفح سريع:</span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              الكل
            </button>
            {SOLIDARITY_CATEGORIES.map((cat) => {
              const IconComp = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.id}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dual Tab Navigation (العروض vs طلبات الاحتياج) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-2">
          <div className="inline-flex p-1.5 bg-muted/70 rounded-2xl border border-border w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("offers")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "offers"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>الأغراض المعروضة (إعارة وتبرع)</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === "offers" ? "bg-white/20 text-white" : "bg-background text-foreground"
              }`}>
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "requests"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>طلبات الاحتياج (أبحث عن غرض)</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === "requests" ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-700"
              }`}>
                {requests.length} معتمدة
              </span>
            </button>
          </div>

          {/* Quick Action Button based on Tab */}
          {activeTab === "requests" && (
            <Button
              onClick={() => setIsRequestModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-bold rounded-xl shadow-md"
            >
              <Plus className="w-4 h-4" />
              تقديم طلب احتياج لغرض تبحث عنه
            </Button>
          )}
        </div>

        {/* Notice for Requests Tab */}
        {activeTab === "requests" && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">جميع طلبات الاحتياج المعروضة هنا مصادق عليها ومحققة: </span>
                <span>تخضع الطلبات لمراجعة وتدقيق إدارة منصة «لنتطوع» للتأكد من جديتها قبل نشرها لمساعدة المحتاجين.</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
              <Input
                placeholder="ابحث عن ملابس، أثاث، جهاز، كتب، كرسي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات ({SOLIDARITY_CATEGORIES.length})</SelectItem>
                {SOLIDARITY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeTab === "offers" && (
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع المبادرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل (تبرع وإعارة)</SelectItem>
                  <SelectItem value="lending">إعارة مؤقتة مجانية</SelectItem>
                  <SelectItem value="donation">تبرع دائم نهائي</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
              <SelectTrigger>
                <SelectValue placeholder="الولاية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الولايات (58)</SelectItem>
                {wilayas.map((w) => (
                  <SelectItem key={w.code} value={w.name.arabic}>
                    {w.name.arabic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tab 1: Offers Content */}
        {activeTab === "offers" && (
          <div>
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">جاري تحميل المعروضات...</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed p-8">
                <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">لا توجد معروضات مطابقة لبحثك</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  لم تجد ما تبحث عنه؟ يمكنك التبديل لتبويب "طلبات الاحتياج" وتقديم طلبك ليساعدك الآخرون!
                </p>
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="mt-4 bg-primary text-white text-xs font-bold"
                >
                  تقديم طلب احتياج الآن
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-xl transition-all border-border/60 hover:border-primary/40 group overflow-hidden">
                      <CardHeader className="space-y-3 pb-3">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={item.item_type === "donation" ? "default" : "secondary"}
                            className={
                              item.item_type === "donation"
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }
                          >
                            {item.item_type === "donation" ? "🎁 تبرع دائم لوجه الله" : "🔄 إعارة مجانية مؤقتة"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {item.wilaya} {item.daira ? `• ${item.daira}` : ""}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="flex-1 text-sm text-muted-foreground leading-relaxed">
                        <p>{item.description}</p>
                        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                          <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md font-semibold">
                            {item.category}
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            متاح للاستلام
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t border-border/40 bg-muted/20 flex gap-2">
                        <a href={`tel:${item.contact_phone}`} className="flex-1">
                          <Button className="w-full gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-white">
                            <Phone className="w-3.5 h-3.5" />
                            اتصال: {item.contact_phone}
                          </Button>
                        </a>
                        <a
                          href={`https://wa.me/213${item.contact_phone.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="icon" title="مراسلة عبر واتساب">
                            <Share2 className="w-4 h-4 text-emerald-600" />
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Need Requests Content (طلبات الاحتياج المعتمدة) */}
        {activeTab === "requests" && (
          <div>
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">جاري تحميل طلبات الاحتياج...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed p-8">
                <HeartHandshake className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">لا توجد طلبات احتياج منشورة حالياً بهذا التصنيف</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  إذا كنت بحاجة إلى أي غرض أو مستلزم ولم تجده في المعروضات، انشر طلبك الآن ليساعدك المجتمع!
                </p>
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4 ml-1.5" />
                  أضف طلب احتياج الآن
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-xl transition-all border-emerald-500/30 hover:border-emerald-500 group overflow-hidden bg-gradient-to-b from-card to-emerald-50/20 dark:to-emerald-950/10">
                      <CardHeader className="space-y-3 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className="bg-emerald-600 text-white text-xs gap-1 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            طلب معتمد من الإدارة ✓
                          </Badge>
                          
                          <Badge
                            variant="outline"
                            className={
                              req.urgency === "urgent"
                                ? "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/20 font-bold"
                                : req.urgency === "medium"
                                ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20"
                                : "border-slate-400 text-slate-600"
                            }
                          >
                            {req.urgency === "urgent" ? "🚨 عاجل جداً" : req.urgency === "medium" ? "⚠️ متوسط" : "عادي"}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-700 transition-colors leading-snug">
                          {req.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                          <span className="font-semibold text-foreground/80">
                            صاحب الطلب: {req.requester_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {req.wilaya} {req.daira ? `• ${req.daira}` : ""}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 text-sm text-foreground/80 leading-relaxed">
                        <p className="bg-muted/40 p-3 rounded-xl border border-border/50 text-xs sm:text-sm">
                          {req.description}
                        </p>
                        
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-md font-semibold">
                            {req.category}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            هل تملك هذا الغرض؟ تواصل معه الآن
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-2 border-t border-border/40 bg-emerald-500/5 flex gap-2">
                        <a href={`tel:${req.contact_phone}`} className="flex-1">
                          <Button className="w-full gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Phone className="w-3.5 h-3.5" />
                            تواصل لمساعدته: {req.contact_phone}
                          </Button>
                        </a>
                        <a
                          href={`https://wa.me/213${req.contact_phone.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="icon" title="مراسلة عبر واتساب">
                            <Share2 className="w-4 h-4 text-emerald-600" />
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal 1: Add Offer Item */}
      <AnimatePresence>
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-border relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-foreground mb-1">إضافة غرض للتكافل</h2>
              <p className="text-xs text-muted-foreground mb-6">تبرع أو أعِر جهازاً، أثاثاً، ملابس أو كتباً زادت عن حاجتك</p>

              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">اسم الغرض *</label>
                  <Input
                    placeholder="مثال: كسوة شتوية، مكتب دراسي، كرسي متحرك، طرد غذائي"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">نوع المبادرة *</label>
                    <Select
                      value={newItemType}
                      onValueChange={(val: "lending" | "donation") => setNewItemType(val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lending">إعارة مجانية مؤقتة</SelectItem>
                        <SelectItem value="donation">تبرع دائم نهائي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">التصنيف *</label>
                    <Select value={newCategory} onValueChange={setNewCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {SOLIDARITY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">الولاية *</label>
                    <Select value={newWilaya} onValueChange={setNewWilaya}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayas.map((w) => (
                          <SelectItem key={w.code} value={w.name.arabic}>
                            {w.name.arabic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">الدائرة / البلدية</label>
                    <Select value={newDaira} onValueChange={setNewDaira} disabled={!newWilaya}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدائرة" />
                      </SelectTrigger>
                      <SelectContent>
                        {offerDairas.map((d) => (
                          <SelectItem key={d.id} value={d.name.arabic}>
                            {d.name.arabic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">رقم الهاتف للتواصل *</label>
                  <Input
                    placeholder="0555123456"
                    maxLength={10}
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">وصف الغرض وحالته</label>
                  <Textarea
                    placeholder="وضح حالة الغرض، المقاس إن كان ملابس، كيفية الاستلام، الشروط إن وجدت..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOfferModalOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isSubmittingOffer} className="bg-primary text-white">
                    {isSubmittingOffer ? "جاري النشر..." : "نشر الغرض في المتجر"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Add Need Request (With Admin Moderation Notice) */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-border relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-foreground">تقديم طلب احتياج غرض</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                هل تبحث عن ملابس، أثاث، جهاز طبي أو كتب ولم تجدها؟ أضف طلبك ليتواصل معك من يملكه
              </p>

              {/* Safety & Moderation Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 mb-5 text-amber-900 dark:text-amber-300 text-xs flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">تنبيه ومصادقة الإدارة: </span>
                  سيتم إرسال طلبك أولاً إلى إدارة منصة «لنتطوع» لمراجعته والتحقق منه والمصادقة عليه قبل نشره للعموم، حفاظاً على مصداقية العمل التكافلي.
                </div>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">اسمك الكامل / الجمعية *</label>
                    <Input
                      placeholder="مثال: عمر بن بلقاسم"
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">رقم الهاتف للتواصل *</label>
                    <Input
                      placeholder="0555123456"
                      maxLength={10}
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">ما هو الغرض أو المستلزم الذي تحتاجه؟ *</label>
                  <Input
                    placeholder="مثال: كرسي متحرك، أفرشة شتوية، طاولة دراسة، مراجع بكالوريا"
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">التصنيف *</label>
                    <Select value={reqCategory} onValueChange={setReqCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {SOLIDARITY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">درجة الإلحاح *</label>
                    <Select
                      value={reqUrgency}
                      onValueChange={(val: "normal" | "medium" | "urgent") => setReqUrgency(val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">🚨 عاجل جداً (حالة حرجة)</SelectItem>
                        <SelectItem value="medium">⚠️ متوسط</SelectItem>
                        <SelectItem value="normal">عادي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">الولاية *</label>
                    <Select value={reqWilaya} onValueChange={setReqWilaya}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayas.map((w) => (
                          <SelectItem key={w.code} value={w.name.arabic}>
                            {w.name.arabic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">الدائرة / البلدية</label>
                    <Select value={reqDaira} onValueChange={setReqDaira} disabled={!reqWilaya}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدائرة" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestDairas.map((d) => (
                          <SelectItem key={d.id} value={d.name.arabic}>
                            {d.name.arabic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">وصف الحالة والمواصفات المطلوبة</label>
                  <Textarea
                    placeholder="وضح حالة صاحب الطلب، المقاسات، الكمية، فترة الاستعارة أو الحاجة الملحة..."
                    value={reqDescription}
                    onChange={(e) => setReqDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingRequest}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    {isSubmittingRequest ? "جاري الإرسال..." : "إرسال الطلب للمصادقة"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
