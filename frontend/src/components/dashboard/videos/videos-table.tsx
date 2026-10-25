"use client"
import type { Video } from "@/data/Videos"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VideosTableProps {
  videos: Video[]
  onEdit: (video: Video) => void
  onDelete: (id: number) => void
}

export default function VideosTable({ videos, onEdit, onDelete }: VideosTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">العنوان</TableHead>
            <TableHead className="text-right">الوصف</TableHead>
            <TableHead className="text-right">نشط</TableHead>
            <TableHead className="text-right">الترتيب</TableHead>
            <TableHead className="text-right">الفيديو</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell className="font-medium">{video.title}</TableCell>
              <TableCell className="max-w-xs truncate">{video.description || "بدون وصف"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${video.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {video.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </TableCell>
              <TableCell>{video.order}</TableCell>
              <TableCell>
                <Link
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <span>عرض</span>
                  <ExternalLink size={16} />
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => onEdit(video)} className="text-primary hover:text-primary/90 p-1">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(video.id)} className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {videos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                لا يوجد فيديوهات مضافة
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
