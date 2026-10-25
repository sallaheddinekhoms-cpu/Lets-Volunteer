"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Scale,
  Award,
  FileText,
  Users,
  CheckCircle2,
  Lock,
  Download,
  ExternalLink,
  Sparkles,
  HeartHandshake,
  Landmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AccreditationPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* National State Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold text-muted-foreground tracking-widest">
            الجمهورية الجزائرية الديمقراطية الشعبية
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Landmark className="w-4 h-4 text-emerald-600" />
            الملف التعريفي لنيل وسم ورعاية الاعتماد الحكومي الرسمي
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground">
            الإطار القانوني وميثاق الاعتماد المؤسساتي
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            منظومة «لنتطوع» مصممة كبنية تحتية رقمية سيادية لدعم جهود الدولة الجزائرية في تأطير، تنظيم، وتثمين العمل التطوعي في ظل القوانين السارية.
          </p>
        </div>

        {/* 4 Pillars of Accreditation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 hover:border-primary/50 transition-all shadow-xs">
            <CardHeader className="pb-2">
              <Scale className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-base font-bold">الامتثال للقانون 12-06</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              تقييد إدراج الفرص التطوعية للجمعيات التي تملك رقماً معتمداً رسمياً صادر عن مصالح وزارة الداخلية أو الولاية.
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/50 transition-all shadow-xs">
            <CardHeader className="pb-2">
              <Lock className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base font-bold">حماية المعطيات (قانون 18-07)</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              الالتزام الصارم بمعايير السلطة الوطنية لحماية المعطيات الشخصية (ANPDP)، وتشفير السجلات واستضافتها محلياً.
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/50 transition-all shadow-xs">
            <CardHeader className="pb-2">
              <Award className="w-8 h-8 text-amber-500 mb-2" />
              <CardTitle className="text-base font-bold">السجل وساعات الخبرة</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              توثيق رسمي تراكمي لساعات التطوع بكشف رسمي موثق يصلح لمعادلة الأرصدة الجامعية ومسابقات التوظيف.
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/50 transition-all shadow-xs">
            <CardHeader className="pb-2">
              <ShieldCheck className="w-8 h-8 text-red-500 mb-2" />
              <CardTitle className="text-base font-bold">بروتوكول السلامة والإغاثة</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              التنسيق الميداني للتطوع الإسعافي والبيئي في حالات الكوارث الطبيعية والأزمات مع الحماية المدنية والهلال الأحمر.
            </CardContent>
          </Card>
        </div>

        {/* Volunteer Charter (ميثاق المتطوع الجزائري) */}
        <div className="space-y-6">
          <Card className="border-border/70 shadow-lg">
            <CardHeader className="bg-muted/20 border-b border-border/40">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                ميثاق حقوق وواجبات المتطوع الجزائري
              </CardTitle>
              <CardDescription>
                المبادئ الأخلاقية والتنظيمية الملزمة لكافة الأطراف الفاعلة على المنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    حقوق المتطوع المكفولة:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <li>• توفير بيئة عمل آمنة ومحترمة تليق بكرامة المتطوع وطاقته.</li>
                    <li>• التغطية والتأمين الإجباري ضد حوادث الميدان أثناء أداء المهام المنشورة.</li>
                    <li>• توفير التدريب والإحاطة الفنية قبل تكليفه بأي مهمة ميدانية أو إسعافية.</li>
                    <li>• الحصول على شهادة إثبات ساعات التطوع المعتمدة فور إتمام المشاركة.</li>
                    <li>• الاحتفاظ بحق الاعتراض أو تقديم شكوى سرية عند تعرضه لأي استغلال غير قانوني.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" />
                    واجبات والتزامات المتطوع:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <li>• احترام القوانين والأنظمة المعمول بها والالتزام بتعليمات المشرفين الميدانيين.</li>
                    <li>• المحافظة على السرية المهنية وعدم المساس بخصوصية ومعطيات المستفيدين.</li>
                    <li>• الامتناع التام عن استغلال العمل التطوعي لأغراض ربحية، حزبية، أو شخصية.</li>
                    <li>• تمثيل القيم الوطنية للجمهورية والتكافل والتضامن الشعبي بأعلى درجات الانضباط.</li>
                    <li>• الحفاظ على العتاد والتجهيزات المودعة لديه وإرجاعها بحالتها الأصلية.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
