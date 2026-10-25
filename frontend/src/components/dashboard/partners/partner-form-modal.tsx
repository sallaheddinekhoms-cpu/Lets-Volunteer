"use client"
import { useState, useEffect } from "react"
import type React from "react"

import type { Partner } from "@/types"

interface PartnerFormModalProps {
  isOpen: boolean
  onClose: () => void
  partner: Partner | null
  onSubmit: (data: Partial<Partner>) => void
}

export default function PartnerFormModal({ isOpen, onClose, partner, onSubmit }: PartnerFormModalProps) {
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: "",
    description: "",
    logo: "",
    website: "",
  })

  // Reset form when modal opens/closes or partner changes
  useEffect(() => {
    if (isOpen) {
      setFormData(
        partner
          ? { ...partner }
          : {
              name: "",
              description: "",
              logo: "",
              website: "",
            },
      )
    }
  }, [isOpen, partner])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{partner ? "تعديل الشريك" : "إضافة شريك جديد"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                اسم الشريك
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                رابط الشعار
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo || ""}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                dir="ltr"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                الموقع الإلكتروني (اختياري)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                dir="ltr"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              {partner ? "حفظ التغييرات" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
