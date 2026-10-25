"use client"

import { Article } from '@/types/articles'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";
import { toast } from 'react-toastify';
import { deleteArticle } from '@/data/admin/Articles';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from 'next/link';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface ArticleTablesProps {
      articles : Article[]
      totalPages:number
      currentPage:number
}

const ArticleTables:React.FC<ArticleTablesProps> = (
      {articles , totalPages , currentPage }
) => {


  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [deleteArticleId, setDeleteArticleId] = React.useState<string | null>(null);


  const handleDelete = async() => {
    if(deleteArticleId) {

      toast.promise(
        deleteArticle(deleteArticleId),
        {
          pending: 'حذف المقال ...',
          success: 'تم حذف المقال بنجاح',
          error: 'حدث خطأ أثناء حذف المقال'
        }
      )



    }

  }


  return (
    <>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-right' >الصورة</TableHead>
          <TableHead className='text-right'>العنوان</TableHead>
          <TableHead className='text-right'>الوصف</TableHead>
          <TableHead className='text-right'>تاريخ النشر</TableHead>
          <TableHead className='text-right'>فيديو</TableHead>
          <TableHead className='text-right'>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell>
              <div className="relative h-10 w-16">
                <Image
                  src={article.article_image || '/images/placeholder.jpg'}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {article.title}
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {article.desc}
            </TableCell>
            <TableCell>{formatDate(article.created_at)}</TableCell>
            <TableCell>
              {article.video ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-red-600">✗</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 space-x-2">
                <Link href={`/dashboard/blog/edit/${article.id}`}  >
                  تعديل
                </Link>
                <Button onClick={()=> { setDeleteArticleId(article.id) ; setShowDeleteDialog(true)  }} variant="destructive" size="sm">
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
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المقال  </AlertDialogTitle>
      
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف المقال
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>

  )
}

export default ArticleTables
