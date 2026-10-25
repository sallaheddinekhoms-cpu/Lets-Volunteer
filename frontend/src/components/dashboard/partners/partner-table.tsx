"use client"
import type { Partner } from "@/types"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PartnersTableProps {
  partners: Partner[]
  onEdit: (partner: Partner) => void
  onDelete: (id: string) => void
}

export default function PartnersTable({ partners, onEdit, onDelete }: PartnersTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الشعار</TableHead>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">الوصف</TableHead>
            <TableHead className="text-right">الموقع الإلكتروني</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <img src={partner.logo} alt="Partner logo" className="w-24 h-24 object-contain" />
                </div>
              </TableCell>
              <TableCell className="font-medium">{partner.name}</TableCell>
              <TableCell className="max-w-xs truncate">{partner.description}</TableCell>
              <TableCell>
                {partner.website ? (
                  <Link
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <span className="truncate max-w-[150px]">{partner.website}</span>
                    <ExternalLink size={16} />
                  </Link>
                ) : (
                  <span className="text-gray-400">غير متوفر</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => onEdit(partner)} className="text-primary hover:text-primary/90 p-1">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(partner.id)} className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {partners.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                لا يوجد شركاء مضافين
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
