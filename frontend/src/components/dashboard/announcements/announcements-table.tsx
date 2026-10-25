"use client"
import type { Announcement } from "@/data/Announcements"
import { Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AnnouncementsTableProps {
  announcements: Announcement[]
  onEdit: (announcement: Announcement) => void
  onDelete: (id: number) => void
}

export default function AnnouncementsTable({ announcements, onEdit, onDelete }: AnnouncementsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الصورة</TableHead>
            <TableHead className="text-right">العنوان</TableHead>
            <TableHead className="text-right">الوصف</TableHead>
            <TableHead className="text-right">نشط</TableHead>
            <TableHead className="text-right">الترتيب</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                  <img src={announcement.image_url} alt={announcement.title} className="w-full h-full object-cover" />
                </div>
              </TableCell>
              <TableCell className="font-medium">{announcement.title}</TableCell>
              <TableCell className="max-w-xs truncate">{announcement.description || "بدون وصف"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {announcement.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </TableCell>
              <TableCell>{announcement.order}</TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => onEdit(announcement)} className="text-primary hover:text-primary/90 p-1">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(announcement.id)} className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {announcements.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                لا يوجد إعلانات مضافة
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
