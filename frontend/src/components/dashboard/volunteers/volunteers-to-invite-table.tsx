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
import { Checkbox } from "@/components/ui/checkbox";
import { Volunteer } from "@/types";
import { toast } from "react-toastify";
import algerianWilayas from 'algeria-wilayas';
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
import { sendInvitaions } from "@/data/Participations";
import Link from "next/link";

interface InviteVolunteersTableProps {
  volunteers: Volunteer[]
  currentPage: number
  totalPages: number
  opportunityId: string
}

const InviteVolunteersTable: React.FC<InviteVolunteersTableProps> = ({ 
  volunteers, 
  currentPage, 
  totalPages ,
  opportunityId
}) => {
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

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

  const handleSelectAll = () => {
    if (selectedVolunteers.length === volunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map(volunteer => volunteer.id));
    }
  };

  const handleSelectVolunteer = (id: string) => {
    if (selectedVolunteers.includes(id)) {
      setSelectedVolunteers(selectedVolunteers.filter(volunteerId => volunteerId !== id));
    } else {
      setSelectedVolunteers([...selectedVolunteers, id]);
    }
  };

  const handleSendInvitations = async () => {
    if (selectedVolunteers.length === 0) {
      toast.error("الرجاء تحديد متطوع واحد على الأقل");
      return;
    }
    
    setShowInviteDialog(true);
  };

  const confirmSendInvitations = async () => {
   
    toast.promise(
      sendInvitaions(selectedVolunteers,opportunityId),
      {
        pending: "جاري إرسال الدعوة...",
        success: "تم إرسال الدعوة بنجاح",
        error: "حدث خطأ أثناء إرسال الدعوة"
      }
    )
    
  };

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">دعوة المتطوعين</h2>
        <Button 
          variant="default" 
          onClick={handleSendInvitations}
          disabled={selectedVolunteers.length === 0}
          className="text-white"
        >
          إرسال دعوة ({selectedVolunteers.length})
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">
              <Checkbox 
                checked={volunteers.length > 0 && selectedVolunteers.length === volunteers.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="text-right">الاسم الأول</TableHead>
            <TableHead className="text-right">الاسم الأخير</TableHead>
            <TableHead className="text-right">العمر</TableHead>
            <TableHead className="text-right">الولاية</TableHead>
            <TableHead className="text-right">الدائرة</TableHead>
            <TableHead className="text-right">فصيلة الدم</TableHead>
            <TableHead className="text-right">
              اجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteers.map((volunteer) => (
            <TableRow key={volunteer.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedVolunteers.includes(volunteer.id)}
                  onCheckedChange={() => handleSelectVolunteer(volunteer.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {volunteer.first_name}
              </TableCell>
              <TableCell>{volunteer.last_name}</TableCell>
              <TableCell>{calculateAge(volunteer.date_of_birth)}</TableCell>
              <TableCell>{algerianWilayas.getWilayaByCode(volunteer.wilaya)?.name.arabic || "N/A"}</TableCell>
              <TableCell>{volunteer.daira}</TableCell>
              <TableCell>{volunteer.blood_group}</TableCell>
              <TableCell>
                <Link href={`/volunteer/${volunteer.id}`}>
                
                  <Button variant="default" className="text-white">
                    عرض الملف الشخصي
                  </Button>
                </Link>
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

      <AlertDialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>إرسال دعوة للمتطوعين</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إرسال الدعوة إلى {selectedVolunteers.length} متطوع.
            </AlertDialogDescription>
          </AlertDialogHeader>
         
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSendInvitations}
              className="bg-primary text-white hover:bg-primary/90"
            >
              إرسال الدعوة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default InviteVolunteersTable