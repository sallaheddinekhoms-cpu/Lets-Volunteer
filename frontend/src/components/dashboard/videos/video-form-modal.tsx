"use client"
import { useState, useEffect } from "react"
import type React from "react"
import type { Video } from "@/data/Videos"

interface VideoFormModalProps {
  isOpen: boolean
  onClose: () => void
  video: Video | null
  onSubmit: (formData: FormData) => void
}

export default function VideoFormModal({ isOpen, onClose, video, onSubmit }: VideoFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_active: true,
    order: 0,
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)

  // Reset form when modal opens/closes or video changes
  useEffect(() => {
    if (isOpen) {
      if (video) {
        setFormData({
          title: video.title,
          description: video.description || "",
          is_active: video.is_active,
          order: video.order,
        })
      } else {
        setFormData({
          title: "",
          description: "",
          is_active: true,
          order: 0,
        })
      }
      setVideoFile(null)
    }
  }, [isOpen, video])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitFormData = new FormData()
    submitFormData.append('title', formData.title)
    submitFormData.append('description', formData.description)
    submitFormData.append('is_active', formData.is_active.toString())
    submitFormData.append('order', formData.order.toString())
    
    if (videoFile) {
      submitFormData.append('video_file', videoFile)
    }
    
    onSubmit(submitFormData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{video ? "تعديل الفيديو" : "إضافة فيديو جديد"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                الوصف (اختياري)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="video_file" className="block text-sm font-medium text-gray-700 mb-1">
                ملف الفيديو {video ? "(اختياري - اتركه فارغاً للاحتفاظ بالفيديو الحالي)" : ""}
              </label>
              <input
                type="file"
                id="video_file"
                name="video_file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required={!video}
              />
              {video && (
                <p className="text-xs text-gray-500 mt-1">
                  الفيديو الحالي: <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-primary">عرض</a>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                الترتيب
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                نشط
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              {video ? "حفظ التغييرات" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
