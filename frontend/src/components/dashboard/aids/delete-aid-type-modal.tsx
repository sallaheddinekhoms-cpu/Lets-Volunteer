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
import { Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import type { AidType } from "@/types/aids"
import { deleteAidType } from "@/data/Aids"

interface DeleteAidTypeModalProps {
  aidType: AidType
  onDeleteSuccess?: () => void
  trigger?: React.ReactNode
}

// This function would be implemented in your data layer


const DeleteAidTypeModal: React.FC<DeleteAidTypeModalProps> = ({ aidType, onDeleteSuccess, trigger }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      toast
        .promise(deleteAidType(aidType.id.toString()), {
          pending: "جاري حذف النشاط الاجتماعي...",
          success: "تم حذف النشاط الاجتماعي بنجاح",
          error: "حدث خطأ أثناء حذف النشاط الاجتماعي",
        })
        .then(() => {
          setOpen(false)
          // Call the success callback if provided
          if (onDeleteSuccess) {
            onDeleteSuccess()
          }
        })
    } catch (error) {
      console.error("Failed to delete aid type:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">حذف</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">حذف النشاط الاجتماعي</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من رغبتك في حذف النشاط الاجتماعي &quot;{aidType.label}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start gap-2 mt-6">
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
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "جاري الحذف..." : "تأكيد الحذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAidTypeModal
