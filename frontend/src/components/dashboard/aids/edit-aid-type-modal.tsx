"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Pencil } from "lucide-react"
import { toast } from "react-toastify"
import { updateAidType } from "@/data/Aids"
import type { AidType } from "@/types/aids"

interface EditAidTypeModalProps {
  aidType: AidType
  onEditSuccess?: () => void
  trigger?: React.ReactNode
}

const EditAidTypeModal: React.FC<EditAidTypeModalProps> = ({ aidType, onEditSuccess, trigger }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AidType>(aidType)

  // Update form data when aidType changes
  useEffect(() => {
    setFormData({
      ...aidType,
      description: aidType.description || "", // Convert null to empty string
    })
  }, [aidType])

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
      toast
        .promise(updateAidType(formData), {
          pending: "جاري تحديث النشاط الاجتماعي...",
          success: "تم تحديث النشاط الاجتماعي بنجاح",
          error: "حدث خطأ أثناء تحديث النشاط الاجتماعي",
        })
        .then(() => {
          setOpen(false)
          // Call the success callback if provided
          if (onEditSuccess) {
            onEditSuccess()
          }
        })
    } catch (error) {
      console.error("Failed to update aid type:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
            <Pencil className="w-4 h-4" />
            <span className="sr-only">تعديل</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">تعديل النشاط الاجتماعي</DialogTitle>
          <DialogDescription>قم بتعديل معلومات النشاط الاجتماعي. اضغط على حفظ عند الانتهاء.</DialogDescription>
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
                value={formData.description || ""} // Ensure value is never null
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
            <Button
              type="submit"
              className="w-full text-white sm:w-auto bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditAidTypeModal
