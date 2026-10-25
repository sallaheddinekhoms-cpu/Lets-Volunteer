"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Volunteer } from "@/types";
import Link from "next/link";
import algerianWilayas from 'algeria-wilayas';
interface VolunteersTableProps {
  volunteers: Volunteer[]
  currentPage: number
  totalPages: number
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { deleteVolunteer } from "@/data/admin/Volunteers";

const VolunteersTable: React.FC<VolunteersTableProps> = (
  { volunteers, currentPage, totalPages }
) => {

  console.log("volunteers", volunteers)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [volunteerId, setVolunteerId] = useState<string | null>(null);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleClickDeleteButton = (id:string) => {
    setVolunteerId(id);
    setShowDeleteDialog(true);

  }
  const handleDelete = async() => {
    
    setShowDeleteDialog(false);
    if (volunteerId) {
      toast.promise(
        deleteVolunteer(volunteerId),
        {
          pending: "حذف المتطوع...",
          success: "تم حذف المتطوع بنجاح",
          error: "حدث خطأ أثناء حذف المتطوع. الرجاء المحاولة مرة أخرى"
        }
      )
    }
  };

  return (
    <div dir="rtl" className="space-y-4">




      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right" >الاسم الأول</TableHead>
            <TableHead className="text-right">الاسم الأخير</TableHead>
            <TableHead className="text-right">العمر</TableHead>
            <TableHead className="text-right">الولاية</TableHead>
            <TableHead className="text-right">الدائرة</TableHead>
            <TableHead className="text-right">فصيلة الدم</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteers.map((volunteer) => (
            <TableRow key={volunteer.id}>
              <TableCell className="font-medium">
                {volunteer.first_name}
              </TableCell>
              <TableCell>{volunteer.last_name}</TableCell>
              <TableCell>{calculateAge(volunteer.date_of_birth)}</TableCell>
              <TableCell>{algerianWilayas.getWilayaByCode(volunteer.wilaya)?.name.arabic || "N/A"}</TableCell>
              <TableCell>{volunteer.daira}</TableCell>
              <TableCell>{volunteer.blood_group}</TableCell>
              <TableCell>
                <div className="flex gap-4">
                  <Link target="_blank" href={`/volunteer/${volunteer.id}`}>
                    <Button variant="outline" size="sm">
                      عرض معلومات
                    </Button>
                  </Link>
                  <Button onClick={() => {handleClickDeleteButton(volunteer.id)}} variant="destructive" size="sm">
                    حذف
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="z-50 mb-12 flex flex-row-reverse">
        <PaginationContent>
          <PaginationItem>
            <PaginationNext
              href={`?page=${Number(currentPage) + 1}`}
              onClick={(e) => {
                if (currentPage === totalPages) e.preventDefault();
              }}
              className={`${Number(currentPage) === Number(totalPages)
                  ? "pointer-events-none opacity-50"
                  : ""
                }`}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage == i + 1}
                href={`?page=${i + 1}`}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${currentPage - 1}`}
              onClick={(e) => {
                if (currentPage === 1) e.preventDefault();
              }}
              className={`${Number(currentPage) === 1
                  ? "pointer-events-none opacity-50"
                  : ""
                }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>


      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف حساب المتطوع </AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف جميع المعلومات المتعلقة بهذه المتطوع. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف المتطوع
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default VolunteersTable
