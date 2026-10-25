"use client"

import { useEffect, useState } from "react"
import { Award, Loader2, Plus, Send, X } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getParticipationCertificate, sendCertificate } from "@/data/Certificates"
import { Certificate, CertificateFormData } from "@/types/participation"
import DownloadCertificateButton from "./download-certificate-button"

const MAX_ACTIVITIES = 3
const MAX_SKILLS = 6

const emptyForm: CertificateFormData = {
  place_of_birth: "",
  activities: [],
  skills: [],
  hours: 0,
  partners: "",
}

interface SendCertificateDialogProps {
  participationId: number
  volunteerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SendCertificateDialog({
  participationId,
  volunteerName,
  open,
  onOpenChange,
}: SendCertificateDialogProps) {
  const [form, setForm] = useState<CertificateFormData>(emptyForm)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [skillInput, setSkillInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getParticipationCertificate(participationId)
      .then(({ certificate, defaults }) => {
        setCertificate(certificate)
        const source = certificate ?? defaults
        setForm({
          place_of_birth: source.place_of_birth || "",
          activities: source.activities?.length ? source.activities : [{ title: "", date: "" }],
          skills: source.skills || [],
          hours: source.hours || 0,
          partners: source.partners || "",
        })
      })
      .catch(() => toast.error("تعذر تحميل بيانات الشهادة"))
      .finally(() => setLoading(false))
  }, [open, participationId])

  const updateActivity = (index: number, key: "title" | "date", value: string) => {
    setForm((f) => ({
      ...f,
      activities: f.activities.map((a, i) => (i === index ? { ...a, [key]: value } : a)),
    }))
  }

  const addSkill = () => {
    const skill = skillInput.trim()
    if (!skill || form.skills.includes(skill) || form.skills.length >= MAX_SKILLS) return
    setForm((f) => ({ ...f, skills: [...f.skills, skill] }))
    setSkillInput("")
  }

  const handleSend = async () => {
    const activities = form.activities
      .filter((a) => a.title.trim())
      .map((a) => ({ title: a.title.trim(), date: a.date || null }))

    if (activities.length === 0) {
      toast.error("أضف نشاطاً واحداً على الأقل")
      return
    }

    setSending(true)
    try {
      const sent = await sendCertificate(participationId, {
        ...form,
        activities: activities as CertificateFormData["activities"],
      })
      setCertificate(sent)
      toast.success("تم إرسال الشهادة إلى بريد المتطوع بنجاح")
    } catch {
      toast.error("حدث خطأ أثناء إرسال الشهادة")
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            شهادة متطوع
          </DialogTitle>
          <DialogDescription className="text-right">
            ستُرسل الشهادة إلى البريد الإلكتروني لـ <span className="font-semibold">{volunteerName}</span> ويمكنه تحميلها من المنصة.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {certificate && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800 flex items-center justify-between gap-2 flex-wrap">
                <span>
                  أُرسلت الشهادة <span dir="ltr" className="font-mono">{certificate.serial_number}</span>
                  {certificate.sent_at && ` بتاريخ ${new Date(certificate.sent_at).toLocaleDateString("ar-DZ")}`}
                </span>
                <DownloadCertificateButton certificateId={certificate.id} variant="outline" size="sm" className="gap-1 h-8" label="تحميل" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>مكان الميلاد</Label>
                <Input
                  value={form.place_of_birth}
                  onChange={(e) => setForm({ ...form, place_of_birth: e.target.value })}
                  placeholder="مثال: سطيف"
                />
              </div>
              <div className="space-y-2">
                <Label>عدد ساعات التطوع</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: Math.max(0, parseInt(e.target.value) || 0) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الأنشطة التي شارك فيها</Label>
              {form.activities.map((activity, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    className="flex-1"
                    value={activity.title}
                    onChange={(e) => updateActivity(i, "title", e.target.value)}
                    placeholder="عنوان النشاط"
                  />
                  <Input
                    type="date"
                    className="w-40"
                    value={activity.date || ""}
                    onChange={(e) => updateActivity(i, "date", e.target.value)}
                  />
                  {form.activities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setForm({ ...form, activities: form.activities.filter((_, j) => j !== i) })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {form.activities.length < MAX_ACTIVITIES && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setForm({ ...form, activities: [...form.activities, { title: "", date: "" }] })}
                >
                  <Plus className="w-4 h-4" /> إضافة نشاط
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>المهارات المكتسبة ({form.skills.length}/{MAX_SKILLS})</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="اكتب مهارة ثم اضغط إضافة"
                  disabled={form.skills.length >= MAX_SKILLS}
                />
                <Button type="button" variant="outline" onClick={addSkill} disabled={form.skills.length >= MAX_SKILLS}>
                  إضافة
                </Button>
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">
                      {skill}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) })}
                        aria-label={`حذف ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>الشركاء والداعمون (اختياري)</Label>
              <Input
                value={form.partners}
                maxLength={300}
                onChange={(e) => setForm({ ...form, partners: e.target.value })}
                placeholder="مثال: مديرية الشباب والرياضة - الهلال الأحمر الجزائري"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row-reverse gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>إغلاق</Button>
          <Button className="text-white gap-2" onClick={handleSend} disabled={loading || sending}>
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {certificate ? "تحديث وإعادة الإرسال" : "إرسال الشهادة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
