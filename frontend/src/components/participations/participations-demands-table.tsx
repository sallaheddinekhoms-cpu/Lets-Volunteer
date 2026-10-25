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
import { Award, MessageSquare, Star, Users } from 'lucide-react';
import StatusBadge from '../ui/custom/status-badge';
import SendCertificateDialog from '../certificates/send-certificate-dialog';

interface ParticipationPageTableProps {
  participations_demands: ParticipationForOrganization[]
}

import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { changeStatusofParticipation, participationStats } from '@/data/Participations';

export interface VolunteerFeedbackData {
  rating: number;           // 1-5 star rating
  hours_worked: number;     // Number of hours the volunteer worked
  organization_feedback: string;  // Text feedback from the organization
}
export const statusConfig = {
  accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "مقبول" },
  done: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "منجز" },
  refused: { color: "bg-red-100 text-red-800", icon: XCircle, label: "مرفوض" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "قيد الانتظار" }
} 

const ParticipationPageTable: React.FC<ParticipationPageTableProps> = (
  { participations_demands }
) => {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoursWorked, setHoursWorked] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [certificateFor, setCertificateFor] = useState<ParticipationForOrganization | null>(null);

  const handleStatusChange = (id: number, status: string) => {
    toast.promise(
      changeStatusofParticipation(id, status),
      {
        pending: "جاري تغيير الحالة",
        success: "تم تغيير الحالة بنجاح",
        error: "حدث خطأ أثناء تغيير الحالة"
      }
    )
  }

  const openFeedbackDialog = (id: number) => {
    setSelectedParticipation(id);
    setFeedbackDialogOpen(true);
  }

  const handleFeedbackSubmit = () => {
    if (!selectedParticipation) return;
    
    // Fix for NaN issue - validate and default to 0 if empty or invalid
    const hours = hoursWorked.trim() === "" ? 0 : parseInt(hoursWorked);
    
    const feedbackData = {
      rating: rating,
      hours_worked: isNaN(hours) ? 0 : hours, // Ensure we never pass NaN
      organization_feedback: feedback
    };

    toast.promise(
      participationStats(feedbackData, selectedParticipation),
      {
        pending: "جاري إرسال التقييم",
        success: "تم إرسال التقييم بنجاح",
        error: "حدث خطأ أثناء إرسال التقييم"
      }
    ).then(() => {
      setFeedbackDialogOpen(false);
      resetFeedbackForm();
    });
  }

  const resetFeedbackForm = () => {
    setRating(0);
    setHoursWorked("");
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
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">رقم الهاتف</TableHead>
                <TableHead className="text-right">الولاية</TableHead>
                <TableHead className="text-right">الدائرة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
                <TableHead className="text-right">ملف المتطوع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participations_demands.map((demand) => (
                <TableRow key={demand.id} className="hover:bg-muted/5">
                  <TableCell className="text-right font-medium">
                    {demand.volunteer?.first_name || 'N/A'} {demand.volunteer?.last_name || ''}
                  </TableCell>
                  <TableCell className="text-right">{demand.volunteer?.date_of_birth ? calculateAge(demand.volunteer.date_of_birth) : 'N/A'} سنة</TableCell>
                  <TableCell className="text-right">{demand.volunteer?.email || 'N/A'}</TableCell>
                  <TableCell className="text-right">{demand.volunteer?.phone_number || 'N/A'}</TableCell>
                  <TableCell className="text-right">{demand.volunteer?.wilaya || 'N/A'}</TableCell>
                  <TableCell className="text-right">{demand.volunteer?.daira || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={demand.status} />
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
                      
                      {demand.status === "done" && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="gap-1"
                          onClick={() => openFeedbackDialog(demand.id)}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>تقييم المتطوع</span>
                        </Button>
                      )}

                      {demand.status === "done" && (
                        <Button
                          variant={demand.certificate ? "outline" : "default"}
                          size="sm"
                          className={`gap-1 ${demand.certificate ? "" : "text-white"}`}
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
                        <span className="text-primary hover:border-b-2 hover:border-primary">عرض الملف</span>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">غير متاح</span>
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

      <Dialog
        open={feedbackDialogOpen}
        onOpenChange={(open) => {
          setFeedbackDialogOpen(open);
          if (!open) resetFeedbackForm();
        }}
      >
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">تقييم المتطوع</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-right block font-medium">التقييم</label>
              <div className="flex gap-1 justify-end">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-gray-300 hover:text-yellow-400 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : ''}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-right block font-medium">عدد ساعات العمل</label>
              <Input
                type="number"
                dir="rtl"
                className="text-right"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                min="0"
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-right block font-medium">ملاحظات التقييم</label>
              <Textarea
                dir="rtl"
                className="text-right h-24"
                placeholder="اكتب ملاحظاتك حول أداء المتطوع هنا..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-row-reverse gap-2">
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>إلغاء</Button>

            <Button 
              className='text-white' 
              onClick={handleFeedbackSubmit}
              disabled={rating === 0} // Disable if no rating is selected
            >
              إرسال التقييم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default ParticipationPageTable