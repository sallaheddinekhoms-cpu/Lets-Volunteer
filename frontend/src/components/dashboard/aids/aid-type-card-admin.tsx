"use client"

import type { AidType } from "@/types/aids"
import type React from "react"
import { useState } from "react"
import { Calendar, Users, ArrowRight, Gift, Copy, Loader2 } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-toastify" // Assuming you're using react-toastify
import { updateAidType } from "@/data/Aids"
import EditAidTypeModal from "./edit-aid-type-modal"
import DeleteAidTypeModal from "./delete-aid-type-modal"

interface AidTypeCardProps {
  aid_type: AidType
  onUpdate?: () => void
  onDelete?: () => void
}

const AdminAidTypeCard: React.FC<AidTypeCardProps> = ({ aid_type, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(aid_type.is_open)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (checked: boolean) => {
    setIsUpdating(true)
    try {
      toast
        .promise(updateAidType({ ...aid_type, is_open: checked }), {
          pending: "جاري تحديث حالة النشاط...",
          success: "تم تحديث حالة النشاط بنجاح",
          error: "حدث خطأ أثناء تحديث حالة النشاط",
        })
        .then(() => {
          setIsOpen(checked)
          if (onUpdate) onUpdate()
        })
    } catch (error) {
      console.error("Failed to update aid type status:", error)
      toast.error("حدث خطأ أثناء تحديث حالة النشاط")
      setIsOpen(aid_type.is_open)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{aid_type.label}</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isOpen ? "مفتوح" : "مغلق"}
              </span>
            </div>
          </div>
          <p className="text-gray-600">{aid_type.description}</p>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span>{aid_type.year}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-5 h-5" />
              <span>{aid_type.beneficiary_count} مستفيد</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
            <span className={isOpen ? "text-gray-400" : "text-gray-700"}>مغلق</span>
            <div className="relative">
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full z-10">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}
              <Switch checked={isOpen} onCheckedChange={handleStatusChange} disabled={isUpdating} />
            </div>
            <span className={isOpen ? "text-gray-700" : "text-gray-400"}>مفتوح</span>
          </div>

          <Link
            href={`/dashboard/aids/${aid_type.id}/duplicates`}
            className="flex items-center gap-2 text-amber-600 border border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 px-3 py-2 rounded-lg text-sm font-medium"
          >
            <Copy className="w-4 h-4" />
            عرض المكررين
          </Link>

          <div className="flex items-center gap-1">
            <EditAidTypeModal aidType={aid_type} onEditSuccess={onUpdate} />

            <DeleteAidTypeModal aidType={aid_type} onDeleteSuccess={onDelete} />

            <Link
              href={`/aids/${aid_type.id}`}
              className="flex items-center gap-2 text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
            >
              عرض المستفيدين
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAidTypeCard
