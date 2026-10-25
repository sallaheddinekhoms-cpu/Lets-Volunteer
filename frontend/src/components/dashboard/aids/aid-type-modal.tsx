"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { toast } from "react-toastify" // Assuming you're using react-toastify for notifications
import { addAidType } from "@/data/Aids"
import { AidType } from "@/types/aids"

interface AddAidTypeModalProps {
  onAddSuccess?: () => void
}

const AddAidTypeModal: React.FC<AddAidTypeModalProps> = ({ onAddSuccess }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AidType>({
    id: 0,
    label: "",
    year: new Date().getFullYear(),
    description: "",
    is_open: true,
    beneficiary_count: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_open: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
     

      toast.promise(
            addAidType(formData),
            {
                  pending: "جاري إضافة النشاط الاجتماعي...",
                  success: "تم إضافة النشاط الاجتماعي بنجاح",
                  error: "حدث خطأ أثناء إضافة النشاط الاجتماعي",
            }
      ).then(()=>{
            setOpen(false)
            setFormData({
              id: 0,
              label: "",
              year: new Date().getFullYear(),
              description: "",
              is_open: true,
              beneficiary_count: 0,
            })
      })

      // Call the success callback if provided
      if (onAddSuccess) {
        onAddSuccess()
      }
    } catch (error) {
      console.error("Failed to add aid type:", error)
      toast.error("حدث خطأ أثناء إضافة النشاط الاجتماعي")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/90">
          <Plus className="w-5 h-5 mr-2" />
          إضافة نشاط جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">إضافة نشاط اجتماعي جديد</DialogTitle>
          <DialogDescription>أدخل معلومات النشاط الاجتماعي الجديد. اضغط على حفظ عند الانتهاء.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-right block">
                اسم النشاط <span className="text-red-500">*</span>
              </Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="أدخل اسم النشاط الاجتماعي"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-right block">
                السنة <span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                min="2000"
                max="2100"
                value={formData.year}
                onChange={handleChange}
                placeholder="أدخل السنة"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-right block">
                وصف النشاط
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="أدخل وصفاً مختصراً للنشاط الاجتماعي"
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_open" className="text-right">
                حالة النشاط
              </Label>
              <div className="flex items-center gap-2">
                <span className={formData.is_open ? "text-gray-400" : "text-gray-700 font-medium"}>مغلق</span>
                <Switch id="is_open" checked={formData.is_open} onCheckedChange={handleSwitchChange} />
                <span className={formData.is_open ? "text-gray-700 font-medium" : "text-gray-400"}>مفتوح</span>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-start gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" className="w-full text-white sm:w-auto bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAidTypeModal
