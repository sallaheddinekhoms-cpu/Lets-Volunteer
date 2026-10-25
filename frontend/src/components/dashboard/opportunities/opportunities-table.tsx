"use client"
import React, { useState } from 'react'
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OpportunityForCardList } from '@/types/opportunity';
import Link from 'next/link';
import {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationLink,
      PaginationNext,
      PaginationPrevious,
} from "@/components/ui/pagination";
import OpportunityModalDelete from './opportunity-delete-modal';
import { toast } from 'react-toastify';
import { deleteOpportunity, updateOpportunity } from '@/data/Opportunities';
import OpportunityModalActivationEdit from './opportunity-activate-modal';
import algerianWilayas from 'algeria-wilayas';



interface OpportunitiesTableProps {
      opportunities: OpportunityForCardList[]
      totalPages: number;
      currentPage: number;
}

const OpportunitiesTable: React.FC<OpportunitiesTableProps> = (
      { opportunities, totalPages, currentPage }
) => {

      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showActivationChangingStatus , setshowActivationChangingStatus] = useState(false);
      const [opportunityId, setOpportunityId] = useState<string | null>(null); 


      const handleClickDeleteButton = (id: string) => {
            setOpportunityId(id);
            setShowDeleteDialog(true);
      }

      const handleDelete = async () => {

           if (opportunityId) {
                 toast.promise(
                       deleteOpportunity(opportunityId),
                       {
                             pending: 'جاري حذف الفرصة التطوعية',
                             success: 'تم حذف الفرصة التطوعية بنجاح',
                             error: 'حدث خطأ اثناء حذف الفرصة التطوعية'
                       }
                 );
           }
           setOpportunityId(null);
           setShowDeleteDialog(false);
      }


      const handleChangeActivationStatus = async (id: string) => {
            setOpportunityId(id);
            setshowActivationChangingStatus(true);
      }


      const handleEdit = async () => {

            if (opportunityId) {
                  if(opportunities.find(opportunity => opportunity.id === opportunityId)?.is_active){
                        toast.promise(
                              updateOpportunity(opportunityId,{is_active:false}),
                              {
                                    pending: 'جاري تعطيل الفرصة التطوعية',
                                    success: 'تم تعطيل الفرصة التطوعية بنجاح',
                                    error: 'حدث خطأ اثناء تعطيل الفرصة التطوعية'
                              }
                        );

                  }else{
                        toast.promise(
                              updateOpportunity(opportunityId,{is_active:true}),
                              {
                                    pending: 'جاري تفعيل الفرصة التطوعية',
                                    success: 'تم تفعيل الفرصة التطوعية بنجاح',
                                    error: 'حدث خطأ اثناء تفعيل الفرصة التطوعية'
                              }
                        );
                  }
                  
            }
            setOpportunityId(null);
       }
 


      return (
            <div className="space-y-4" >
                  <Table>
                        <TableHeader>
                              <TableRow>
                                    <TableHead className="text-right">العنوان</TableHead>
                                    <TableHead className="text-right">المنظمة</TableHead>
                                    <TableHead className="text-right">التصنيف</TableHead>
                                    <TableHead className="text-right">الولاية</TableHead>
                                    <TableHead className="text-right">متاح</TableHead>
                                    <TableHead className="text-right">الإجراءات</TableHead>
                              </TableRow>
                        </TableHeader>
                        <TableBody>
                              {opportunities.map((opportunity) => (
                                    <TableRow key={opportunity.id}>
                                          <TableCell className="font-medium">
                                                {opportunity.title}
                                          </TableCell>
                                          <TableCell className="text-right" >{opportunity.organization}</TableCell>
                                          <TableCell className="text-right">{opportunity.category?.label}</TableCell>
                                          <TableCell className="text-right">{algerianWilayas.getWilayaByCode(opportunity.wilaya)?.name.arabic || "N/A"}</TableCell>
                                          <TableCell className="text-right">
                                                {opportunity.is_available ? (
                                                      <Badge className='text-white' variant="default">مفعل</Badge>
                                                ) : (
                                                      <Badge variant="destructive">غير مفعل</Badge>
                                                )}
                                          </TableCell>

                                          <TableCell>
                                                <div className="flex gap-4 space-x-2">
                                                      <Link passHref href={`/dashboard/opportunities/${opportunity.id}/invite`}>

                                                            <Button variant="outline" size="sm">
                                                                  دعوة
                                                            </Button>
                                                      </Link>

                                                      <Link passHref href={`/opportunities/${opportunity.id}`}>

                                                            <Button variant="outline" size="sm">
                                                                  تفاصيل
                                                            </Button>
                                                      </Link>
                                                      {!opportunity.is_active ? (
                                                            <Button onClick={()=>{handleChangeActivationStatus(opportunity.id)}} className='text-white' variant="default" size="sm">
                                                                  تفعيل
                                                            </Button>) : (
                                                            <Button onClick={()=>{handleChangeActivationStatus(opportunity.id)}}  variant="destructive" size="sm">
                                                                  تعطيل
                                                            </Button>
                                                      )}

                                                      <Button onClick={()=>{handleClickDeleteButton(opportunity.id) }} variant="destructive" size="sm">
                                                            حذف
                                                      </Button>
                                                      <Link passHref href={`/opportunities/${opportunity.id}/participations`}>
                                                            <Button variant="default" className='text-white' size="sm">
                                                                  عرض طلبات المشاركة
                                                            </Button>
                                                      </Link>
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

            <OpportunityModalDelete 
            showDeleteDialog={showDeleteDialog} 
            setShowDeleteDialog={setShowDeleteDialog} 
            handleDelete={handleDelete} />

            <OpportunityModalActivationEdit 
            showActivationChangingStatus={showActivationChangingStatus} 
            setshowActivationChangingStatus={setshowActivationChangingStatus} 
            handleChangeActivationStatus={handleEdit}
            />

            


            </div>
      )
}

export default OpportunitiesTable
