"use client"
import { useState, useEffect } from "react"
import type React from "react"
import type { Announcement } from "@/data/Announcements"

interface AnnouncementFormModalProps {
  isOpen: boolean
  onClose: () => void
  announcement: Announcement | null
  onSubmit: (formData: FormData) => void
}

export default function AnnouncementFormModal({ isOpen, onClose, announcement, onSubmit }: AnnouncementFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_active: true,
    order: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Reset form when modal opens/closes or announcement changes
  useEffect(() => {
    if (isOpen) {
      if (announcement) {
        setFormData({
          title: announcement.title,
          description: announcement.description || "",
          is_active: announcement.is_active,
          order: announcement.order,
        })
      } else {
        setFormData({
          title: "",
          description: "",
          is_active: true,
          order: 0,
        })
      }
      setImageFile(null)
    }
  }, [isOpen, announcement])

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
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitFormData = new FormData()
    submitFormData.append('title', formData.title)
    submitFormData.append('description', formData.description)
    submitFormData.append('is_active', formData.is_active.toString())
    submitFormData.append('order', formData.order.toString())
    
    if (imageFile) {
      submitFormData.append('image_file', imageFile)
    }
    
    onSubmit(submitFormData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{announcement ? "تعديل الإعلان" : "إضافة إعلان جديد"}</h2>
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
              <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-1">
                صورة الإعلان {announcement ? "(اختياري - اتركه فارغاً للاحتفاظ بالصورة الحالية)" : ""}
              </label>
              <input
                type="file"
                id="image_file"
                name="image_file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required={!announcement}
              />
              {announcement && (
                <div className="mt-2">
                  <img src={announcement.image_url} alt="معاينة" className="w-32 h-32 object-cover rounded" />
                </div>
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
              {announcement ? "حفظ التغييرات" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
