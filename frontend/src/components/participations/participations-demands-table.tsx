"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { calculateAge } from '@/lib/utils';
import { ParticipationForOrganization } from '@/types/participation';
import { Button } from '../ui/button';
import { Award, MessageSquare, Star, Users, Sparkles, Truck, Wrench, HeartHandshake, ShieldCheck, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import StatusBadge from '../ui/custom/status-badge';
import SendCertificateDialog from '../certificates/send-certificate-dialog';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { changeStatusofParticipation, completeParticipationWithValuation } from '@/data/Participations';

interface ParticipationPageTableProps {
  participations_demands: ParticipationForOrganization[]
}

export const statusConfig = {
  accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "مقبول" },
  done: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "منجز ومثمن" },
  refused: { color: "bg-red-100 text-red-800", icon: XCircle, label: "مرفوض" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "قيد الانتظار" }
}

const ParticipationPageTable: React.FC<ParticipationPageTableProps> = ({ participations_demands }) => {
  const [valuationDialogOpen, setValuationDialogOpen] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState<number | null>(null);
  
  // Valuation fields
  const [rating, setRating] = useState<number>(5);
  const [hoursWorked, setHoursWorked] = useState<string>("4");
  const [skillLevel, setSkillLevel] = useState<"general" | "specialist" | "lead">("general");
  const [providedTransport, setProvidedTransport] = useState<boolean>(false);
  const [providedEquipment, setProvidedEquipment] = useState<boolean>(false);
  const [providedDonation, setProvidedDonation] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  
  const [certificateFor, setCertificateFor] = useState<ParticipationForOrganization | null>(null);

  // Live calculation of estimated impact hours
  const baseHours = Math.max(0, parseFloat(hoursWorked) || 0);
  const fieldCredit = baseHours * 1.5;
  const skillCredit = skillLevel === 'specialist' ? 2 : skillLevel === 'lead' ? 3 : 0;
  const transportCredit = providedTransport ? 3 : 0;
  const equipmentCredit = providedEquipment ? 2 : 0;
  const donationCredit = providedDonation ? 3 : 0;
  const ratingCredit = rating === 5 ? 1 : 0;
  const totalCalculatedHours = (fieldCredit + skillCredit + transportCredit + equipmentCredit + donationCredit + ratingCredit);

  const handleStatusChange = (id: number, status: string) => {
    if (status === "done") {
      openValuationDialog(id);
      return;
    }
    toast.promise(
      changeStatusofParticipation(id, status),
      {
        pending: "جاري تغيير الحالة",
        success: "تم تغيير الحالة بنجاح",
        error: "حدث خطأ أثناء تغيير الحالة"
      }
    );
  }

  const openValuationDialog = (id: number) => {
    setSelectedParticipation(id);
    const existing = participations_demands.find(p => p.id === id);
    if (existing) {
      setHoursWorked(existing.hours_worked ? String(existing.hours_worked) : "4");
      setRating(existing.rating || 5);
      setSkillLevel(existing.skill_level || "general");
      setProvidedTransport(!!existing.provided_transport);
      setProvidedEquipment(!!existing.provided_equipment);
      setProvidedDonation(!!existing.provided_donation);
      setFeedback(existing.organization_feedback || "");
    }
    setValuationDialogOpen(true);
  }

  const handleValuationSubmit = async () => {
    if (!selectedParticipation) return;
    
    const parsedHours = Math.max(1, parseInt(hoursWorked) || 4);

    try {
      const res = await completeParticipationWithValuation(selectedParticipation, {
        hours_worked: parsedHours,
        rating: rating || 5,
        skill_level: skillLevel,
        provided_transport: providedTransport,
        provided_equipment: providedEquipment,
        provided_donation: providedDonation,
        organization_feedback: feedback
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(`تم تثمين المشاركة واعتماد ${res.data?.calculated_credit_hours || totalCalculatedHours} ساعة تطوعية للمتطوع!`);
        setValuationDialogOpen(false);
        resetValuationForm();
      } else {
        toast.error("حدث خطأ أثناء حفظ التثمين");
      }
    } catch (e: any) {
      toast.error(e?.message || "حدث خطأ غير متوقع");
    }
  }

  const resetValuationForm = () => {
    setRating(5);
    setHoursWorked("4");
    setSkillLevel("general");
    setProvidedTransport(false);
    setProvidedEquipment(false);
    setProvidedDonation(false);
    setFeedback("");
    setSelectedParticipation(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم الكامل</TableHead>
                <TableHead className="text-right">العمر</TableHead>
                <TableHead className="text-right">رقم الهاتف</TableHead>
                <TableHead className="text-right">الولاية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الرصيد المعتمد</TableHead>
                <TableHead className="text-right">الإجراءات وتثمين الأثر</TableHead>
                <TableHead className="text-right">الملف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participations_demands.map((demand) => (
                <TableRow key={demand.id} className="hover:bg-muted/5">
                  <TableCell className="text-right font-medium">
                    {demand.volunteer?.first_name || 'N/A'} {demand.volunteer?.last_name || ''}
                  </TableCell>
                  <TableCell className="text-right">{demand.volunteer?.date_of_birth ? calculateAge(demand.volunteer.date_of_birth) : 'N/A'} سنة</TableCell>
                  <TableCell className="text-right">{demand.volunteer?.phone_number || 'N/A'}</TableCell>
                  <TableCell className="text-right">{demand.volunteer?.wilaya || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={demand.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {demand.status === "done" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        {demand.calculated_credit_hours ? `${demand.calculated_credit_hours} س معتمدة` : `${(demand.hours_worked || 4) * 1.5} س`}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-start">
                    <div className="flex gap-2 justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            تغيير الحالة
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {Object.entries(statusConfig).map(([key, value]) => (
                            <DropdownMenuItem
                              key={key}
                              onClick={() => handleStatusChange(demand.id, key)}
                              className="flex items-center gap-2"
                              dir='rtl'
                            >
                              <value.icon className="w-4 h-4" />
                              {value.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        variant={demand.status === "done" ? "outline" : "secondary"} 
                        size="sm"
                        className="gap-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => openValuationDialog(demand.id)}
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>{demand.status === "done" ? "تعديل التثمين" : "تثمين واعتماد المشاركة"}</span>
                      </Button>

                      {demand.status === "done" && (
                        <Button
                          variant={demand.certificate ? "outline" : "default"}
                          size="sm"
                          className={`gap-1 ${demand.certificate ? "" : "text-white bg-emerald-600 hover:bg-emerald-700"}`}
                          onClick={() => setCertificateFor(demand)}
                        >
                          <Award className="w-4 h-4" />
                          <span>{demand.certificate ? "الشهادة مرسلة" : "إرسال الشهادة"}</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {demand.volunteer?.id ? (
                      <Link target='_blank' href={`/volunteer/${demand.volunteer.id}`}>
                        <span className="text-primary hover:border-b-2 hover:border-primary text-sm font-semibold">عرض الملف</span>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-xs">غير متاح</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {participations_demands.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">
            لم يتم العثور على طلبات مطابقة لمعايير البحث
          </p>
        </motion.div>
      )}

      {certificateFor && (
        <SendCertificateDialog
          participationId={certificateFor.id}
          volunteerName={`${certificateFor.volunteer?.first_name || ''} ${certificateFor.volunteer?.last_name || ''}`.trim()}
          open={!!certificateFor}
          onOpenChange={(open) => { if (!open) setCertificateFor(null) }}
        />
      )}

      {/* National Valuation & Impact Modal */}
      <Dialog
        open={valuationDialogOpen}
        onOpenChange={(open) => {
          setValuationDialogOpen(open);
          if (!open) resetValuationForm();
        }}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>تثمين رصيد الساعات والأثر التطوعي للمشارك</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-3">
            {/* 1. Field Hours (with 1.5x) */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-emerald-950">1. ساعات التواجد الميداني الفعلي</label>
                <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">معامل الميدان 1.5x</span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  dir="ltr"
                  className="w-28 text-center font-bold text-lg bg-white"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  min="1"
                  max="48"
                />
                <span className="text-sm text-gray-700">ساعة ميدانية = <strong className="text-emerald-700">{fieldCredit.toFixed(1)}</strong> ساعة تطوعية معتمدة</span>
              </div>
            </div>

            {/* 2. Skill Level */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 block">2. مستوى مهارة وتخصص المتطوع في النشاط</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSkillLevel("general")}
                  className={`p-3 rounded-xl border text-right transition-all ${skillLevel === 'general' ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <p className="font-bold text-xs text-blue-950">مساهم عام / هاوي</p>
                  <p className="text-[11px] text-gray-500 mt-1">تنظيف، مساعدة، نقل مستلزمات</p>
                  <span className="inline-block mt-2 text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">1.0x عادي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSkillLevel("specialist")}
                  className={`p-3 rounded-xl border text-right transition-all ${skillLevel === 'specialist' ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <p className="font-bold text-xs text-indigo-950">منفذ فني متخصص</p>
                  <p className="text-[11px] text-gray-500 mt-1">حرفي دهان، كهرباء، صيانة، تمريض</p>
                  <span className="inline-block mt-2 text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">+2 ساعات بونص</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSkillLevel("lead")}
                  className={`p-3 rounded-xl border text-right transition-all ${skillLevel === 'lead' ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <p className="font-bold text-xs text-purple-950">قائد ورشة / مؤطر فني</p>
                  <p className="text-[11px] text-gray-500 mt-1">إشراف، توجيه وتدريب المتطوعين</p>
                  <span className="inline-block mt-2 text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold">+3 ساعات بونص</span>
                </button>
              </div>
            </div>

            {/* 3. Logistics Support Checkboxes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 block">3. الدعم اللوجستي والمادي المقدم من المتطوع</label>
              <div className="space-y-2 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={providedTransport}
                    onChange={(e) => setProvidedTransport(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span className="text-xs text-gray-800 flex-1">وفر سيارته الخاصة لنقل المتطوعين أو المؤن</span>
                  <span className="text-xs font-bold text-amber-800">+3 ساعات</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={providedEquipment}
                    onChange={(e) => setProvidedEquipment(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <Wrench className="w-4 h-4 text-amber-700" />
                  <span className="text-xs text-gray-800 flex-1">وفر عتاد وأدوات عمل متخصصة للحملة</span>
                  <span className="text-xs font-bold text-amber-800">+2 ساعات</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={providedDonation}
                    onChange={(e) => setProvidedDonation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <HeartHandshake className="w-4 h-4 text-amber-700" />
                  <span className="text-xs text-gray-800 flex-1">قدم مساهمة عينية أو تمويلية لمستلزمات النشاط</span>
                  <span className="text-xs font-bold text-amber-800">+3 ساعات</span>
                </label>
              </div>
            </div>

            {/* 4. Rating & Quality */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <label className="text-sm font-bold text-gray-900 block">4. تقييم أداء وانضباط المتطوع</label>
                <p className="text-[11px] text-gray-500">تقييم 5 نجوم يمنح المتطوع +1 ساعة إضافية كبونص تميز</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback textarea */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">شهادة وملاحظة الجمعية حول أداء المتطوع</label>
              <Textarea
                dir="rtl"
                className="text-right text-xs h-20"
                placeholder="اكتب ملاحظاتك التشجيعية وتوصياتك حول انضباط المتطوع..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            {/* Real-time Calculation Summary Box */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-emerald-100 font-medium">الرصيد الإجمالي المعتمد لهذه المشاركة:</p>
                <p className="text-xs text-emerald-200 mt-0.5">
                  (ميدان: {fieldCredit.toFixed(1)}س)
                  {skillCredit > 0 && ` + (تخصص: ${skillCredit}س)`}
                  {transportCredit + equipmentCredit + donationCredit > 0 && ` + (لوجستيك: ${transportCredit + equipmentCredit + donationCredit}س)`}
                  {ratingCredit > 0 && ` + (تميز: 1س)`}
                </p>
              </div>
              <div className="text-left font-black text-2xl">
                {totalCalculatedHours.toFixed(1)} <span className="text-sm font-normal">ساعة معتمدة</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-row-reverse gap-2 pt-2">
            <Button variant="outline" onClick={() => setValuationDialogOpen(false)}>إلغاء</Button>
            <Button 
              className='text-white bg-emerald-600 hover:bg-emerald-700 font-bold' 
              onClick={handleValuationSubmit}
            >
              اعتماد الرصيد وإتمام المشاركة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default ParticipationPageTable
