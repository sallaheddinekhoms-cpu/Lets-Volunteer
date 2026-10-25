"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "react-toastify"
import type { Partner } from "@/types"
import PartnersTable from "@/components/dashboard/partners/partner-table"
import PartnerFormModal from "@/components/dashboard/partners/partner-form-modal"
import PartnerDeleteModal from "@/components/dashboard/partners/partner-delete-modal"
import { addPartner, removePartner, updatePartner } from "@/data/Partners"


export default  function PartnersList(
      {partners} : {partners:Partner[]}
) {
  


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null)

  const handleOpenAddModal = () => {
    setEditingPartner(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (partner: Partner) => {
    setEditingPartner(partner)
    setIsModalOpen(true)
  }

  const handleOpenDeleteDialog = (id: string) => {
    setPartnerToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleAdd = async (partnerData: Omit<Partner, "id">) => {
    try {
      toast.promise(addPartner(partnerData), {
        pending: "جاري إضافة الشريك...",
        success: "تمت إضافة الشريك بنجاح",
        error: "حدث خطأ أثناء إضافة الشريك",
      })

      // Update local state
      // setPartners([...partners, { ...partnerData, id }])
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error adding partner:", error)
    }
  }

  const handleEdit = async (id: string, partnerData: Partial<Partner>) => {
    try {
      await toast.promise(updatePartner(Number(id), partnerData), {
        pending: "جاري تعديل الشريك...",
        success: "تم تعديل الشريك بنجاح",
        error: "حدث خطأ أثناء تعديل الشريك",
      })

      // Update local state
      // setPartners(partners.map((partner) => (partner.id === id ? { ...partner, ...partnerData } : partner)))
      setIsModalOpen(false)
      setEditingPartner(null)
    } catch (error) {
      console.error("Error updating partner:", error)
    }
  }

  const handleDelete = async () => {
    if (!partnerToDelete) return
    try {
      await toast.promise(removePartner(Number(partnerToDelete)), {
        pending: "جاري حذف الشريك...",
        success: "تم حذف الشريك بنجاح",
        error: "حدث خطأ أثناء حذف الشريك",
      })

      // Update local state
      // setPartners(partners.filter((partner) => partner.id !== partnerToDelete))
      setShowDeleteDialog(false)
      setPartnerToDelete(null)
    } catch (error) {
      console.error("Error deleting partner:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">إدارة الشركاء</h1>
            <button
              onClick={handleOpenAddModal}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <PlusIcon size={20} />
              إضافة شريك جديد
            </button>
          </div>

          <PartnersTable partners={partners} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteDialog} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <PartnerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        partner={editingPartner}
        onSubmit={(data) => {
          if (editingPartner) {
            handleEdit(editingPartner.id, data)
          } else {
            handleAdd(data as Omit<Partner, "id">)
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <PartnerDeleteModal
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleDelete={handleDelete}
      />
    </div>
  )
}

