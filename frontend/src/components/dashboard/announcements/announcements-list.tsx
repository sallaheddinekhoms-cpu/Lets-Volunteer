"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "react-toastify"
import type { Announcement } from "@/data/Announcements"
import { addAnnouncement, deleteAnnouncement, updateAnnouncement } from "@/data/Announcements"
import AnnouncementsTable from "./announcements-table"
import AnnouncementFormModal from "./announcement-form-modal"
import AnnouncementDeleteModal from "./announcement-delete-modal"


export default function AnnouncementsList({ announcements }: { announcements: Announcement[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null)

  const handleOpenAddModal = () => {
    setEditingAnnouncement(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setIsModalOpen(true)
  }

  const handleOpenDeleteDialog = (id: number) => {
    setAnnouncementToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleAdd = async (formData: FormData) => {
    try {
      await toast.promise(addAnnouncement(formData), {
        pending: "جاري إضافة الإعلان...",
        success: "تمت إضافة الإعلان بنجاح",
        error: "حدث خطأ أثناء إضافة الإعلان",
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error adding announcement:", error)
    }
  }

  const handleEdit = async (id: number, formData: FormData) => {
    try {
      await toast.promise(updateAnnouncement(id, formData), {
        pending: "جاري تعديل الإعلان...",
        success: "تم تعديل الإعلان بنجاح",
        error: "حدث خطأ أثناء تعديل الإعلان",
      })
      setIsModalOpen(false)
      setEditingAnnouncement(null)
    } catch (error) {
      console.error("Error updating announcement:", error)
    }
  }

  const handleDelete = async () => {
    if (!announcementToDelete) return
    try {
      await toast.promise(deleteAnnouncement(announcementToDelete), {
        pending: "جاري حذف الإعلان...",
        success: "تم حذف الإعلان بنجاح",
        error: "حدث خطأ أثناء حذف الإعلان",
      })
      setShowDeleteDialog(false)
      setAnnouncementToDelete(null)
    } catch (error) {
      console.error("Error deleting announcement:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">إدارة الإعلانات</h1>
            <button
              onClick={handleOpenAddModal}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <PlusIcon size={20} />
              إضافة إعلان جديد
            </button>
          </div>

          <AnnouncementsTable announcements={announcements} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteDialog} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnnouncementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        announcement={editingAnnouncement}
        onSubmit={(formData) => {
          if (editingAnnouncement) {
            handleEdit(editingAnnouncement.id, formData)
          } else {
            handleAdd(formData)
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <AnnouncementDeleteModal
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleDelete={handleDelete}
      />
    </div>
  )
}
