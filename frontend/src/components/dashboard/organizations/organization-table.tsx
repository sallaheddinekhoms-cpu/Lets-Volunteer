"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Organization } from "@/types";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Wilaya } from "algeria-wilayas";
import algerianWilayas from 'algeria-wilayas';
import { toast } from "react-toastify";
import { deleteOrganization, confirmOrganization, unconfirmOrganization } from "@/data/admin/Organizatons";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrganizationTableProps {
  organizations: Organization[];
  totalPages: number;
  currentPage: number;
  wilayas: Wilaya[];
}

const OrganizationTable = ({
  organizations,
  totalPages,
  currentPage,
}: OrganizationTableProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const router = useRouter();

  const handleClickDeleteButton = (id:string) => {
    setOrganizationId(id);
    setShowDeleteDialog(true);

  }
  const handleDelete = async () => {

    setShowDeleteDialog(false);
    if (organizationId) {
      toast.promise(
        deleteOrganization(organizationId).then(() => router.refresh()),
        {
          pending: "حذف المتطوع...",
          success: "تم حذف المتطوع بنجاح",
          error: "حدث خطأ أثناء حذف المتطوع. الرجاء المحاولة مرة أخرى"
        }
      )
    }
  };

  const handleConfirm = async (id: string) => {
    toast.promise(
      confirmOrganization(id).then(() => router.refresh()),
      {
        pending: "جاري تأكيد الهيئة...",
        success: "تم تأكيد الهيئة بنجاح",
        error: "حدث خطأ أثناء تأكيد الهيئة"
      }
    )
  };

  const handleUnconfirm = async (id: string) => {
    toast.promise(
      unconfirmOrganization(id).then(() => router.refresh()),
      {
        pending: "جاري إلغاء تأكيد الهيئة...",
        success: "تم إلغاء تأكيد الهيئة بنجاح",
        error: "حدث خطأ أثناء إلغاء تأكيد الهيئة"
      }
    )
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الشعار</TableHead>
            <TableHead className="text-right">اسم الهيئة</TableHead>
            <TableHead className="text-right">الولاية</TableHead>
            <TableHead className="text-right">الدائرة</TableHead>
            <TableHead className="text-right">حالة التأكيد</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell>
                <div className="relative h-10 w-10">
                  <img
                    src={org.logo || "/default-logo.png"}
                    alt={org.organization_name}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-right">
                {org.organization_name}
              </TableCell>
              <TableCell className="text-right">{algerianWilayas.getWilayaByCode(org.wilaya || "")?.name.arabic || "N/A"}</TableCell>
              <TableCell className="text-right">{org.daira}</TableCell>
              <TableCell className="text-right">
                <Badge variant={org.is_confirmed ? "default" : "secondary"} className="gap-1">
                  {org.is_confirmed ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      مؤكدة
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      غير مؤكدة
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/dashboard/organizations/${org.id}`}>
                    <Button variant="outline" size="sm">
                      معلومات
                    </Button>
                  </Link>
                  {org.is_confirmed ? (
                    <Button 
                      onClick={() => handleUnconfirm(org.id)} 
                      variant="outline" 
                      size="sm"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      إلغاء التأكيد
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleConfirm(org.id)} 
                      variant="default" 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      تأكيد
                    </Button>
                  )}
                  <Button onClick={()=>{handleClickDeleteButton(org.id)}} variant="destructive" size="sm">
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
            <AlertDialogTitle>هل أنت متأكد من حذف حساب الجمعية </AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف جميع المعلومات المتعلقة بهذه الجمعية. هذا الإجراء لا يمكن التراجع عنه.
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
    </div >
  );
};

export default OrganizationTable;
