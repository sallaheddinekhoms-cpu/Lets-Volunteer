"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "react-toastify"
import type { Video } from "@/data/Videos"

import { addVideo, deleteVideo, updateVideo } from "@/data/Videos"
import VideosTable from "./videos-table"
import VideoFormModal from "./video-form-modal"
import VideoDeleteModal from "./video-delete-modal"


export default function VideosList({ videos }: { videos: Video[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<number | null>(null)

  const handleOpenAddModal = () => {
    setEditingVideo(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (video: Video) => {
    setEditingVideo(video)
    setIsModalOpen(true)
  }

  const handleOpenDeleteDialog = (id: number) => {
    setVideoToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleAdd = async (formData: FormData) => {
    try {
      await toast.promise(addVideo(formData), {
        pending: "جاري إضافة الفيديو...",
        success: "تمت إضافة الفيديو بنجاح",
        error: "حدث خطأ أثناء إضافة الفيديو",
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error adding video:", error)
    }
  }

  const handleEdit = async (id: number, formData: FormData) => {
    try {
      await toast.promise(updateVideo(id, formData), {
        pending: "جاري تعديل الفيديو...",
        success: "تم تعديل الفيديو بنجاح",
        error: "حدث خطأ أثناء تعديل الفيديو",
      })
      setIsModalOpen(false)
      setEditingVideo(null)
    } catch (error) {
      console.error("Error updating video:", error)
    }
  }

  const handleDelete = async () => {
    if (!videoToDelete) return
    try {
      await toast.promise(deleteVideo(videoToDelete), {
        pending: "جاري حذف الفيديو...",
        success: "تم حذف الفيديو بنجاح",
        error: "حدث خطأ أثناء حذف الفيديو",
      })
      setShowDeleteDialog(false)
      setVideoToDelete(null)
    } catch (error) {
      console.error("Error deleting video:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">إدارة الفيديوهات</h1>
            <button
              onClick={handleOpenAddModal}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <PlusIcon size={20} />
              إضافة فيديو جديد
            </button>
          </div>

          <VideosTable videos={videos} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteDialog} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <VideoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={editingVideo}
        onSubmit={(formData) => {
          if (editingVideo) {
            handleEdit(editingVideo.id, formData)
          } else {
            handleAdd(formData)
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <VideoDeleteModal
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleDelete={handleDelete}
      />
    </div>
  )
}
