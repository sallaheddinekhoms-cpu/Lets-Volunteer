"use client"


import Link from 'next/link'
import React, {  useEffect, useRef, useState } from 'react'
import { Plus, Users  } from 'lucide-react'
import { Aid, AidType } from '@/types/aids'
import AddBinifiCiaryModal from '../modals/add-binificiary'
import { toast } from 'react-toastify'
import { addBinificary } from '@/data/Aids'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import BulkUploadBeneficiaries from './bulk-upload-benificiaries'

interface BinificiariesListingProps {
  binificiaries: Aid[];
  aid_type: AidType;
  current_page: number;
  total_pages: number;
  total_items: number;
}


const BinificiariesListing: React.FC<BinificiariesListingProps> = (
  { binificiaries, aid_type, current_page, total_pages, total_items }
) => {

  console.log("aid_type", aid_type)
  const [showAddModal, setShowAddModal] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()


  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      if (query) {
        router.push(`?identity=${query}`);
      } else {
        router.push(`/aids/${aid_type.id}`);
      }
    }, 600);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query, aid_type.id, router]);

  const HandleaddBinificiary = (binificiary_id: string) => {
    const data_type = {
      beneficiary: binificiary_id,
      aid_type: Number(aid_type.id)
    }

    addBinificary(data_type).then((result) => {
      if (result.status === 201) {
        toast.success("تمت إضافة المستفيد بنجاح")
        router.push(`/aids/${aid_type.id}`)
      } else {
        toast.error("المستفيد تمت اضافته من قبل")
      }
    }).catch((error) => {
      toast.error("error", error)
    })



  }
  console.log("current_page", current_page)
  console.log("total_pages", total_pages)


  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/"
                className="text-gray-600 hover:text-gray-900 mb-2"
              >
                ← العودة إلى النشاطات الاجتماعية
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">المستفيدون من {aid_type.label}</h1>
              <div className='flex items-center gap-4' >
                <Users className='w-4 h-4 text-primary' />
                <span className='text-primary text-lg font-semibold'>عدد المستفيدين {total_items} </span>

              </div>

            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة مستفيد
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <BulkUploadBeneficiaries aid_type_id={String(aid_type.id)} />
        </div>

        <div className='mt-4 py-8 flex flex-col items-center gap-4 justify-center'>
          <span>
            البحث عن المستفيدين عن طريق رقم الهوية
          </span>
          <div className='flex items-center gap-4' >
          <Input
              placeholder='بحث عن المستفيدين'
            className='w-96'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)

              }}
            />

            <Button 
            className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors
                      ${query ? "" : "pointer-events-none opacity-50"} `
              }
              onClick={() => HandleaddBinificiary(query)}
            >
              اضافة 
            </Button>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      رقم الهوية
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      المؤسسة
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      تاريخ الإضافة
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {binificiaries.map((beneficiary) => (
                    <tr key={beneficiary.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {beneficiary.beneficiary}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {beneficiary?.organization?.organization_name || "ادمن المنصة"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(parseISO(beneficiary.created_at), 'd MMMM yyyy, h:mm:ss a', { locale: ar })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Pagination className="z-50 pb-12 " dir='ltr' >
          <PaginationContent>
            <PaginationItem
            >
              <PaginationPrevious
                href={`?page=${current_page - 1}`}
                onClick={(e) => {
                  if (current_page === 1)
                    e.preventDefault()
                }}
                className={`${Number(current_page) === 1 ? "pointer-events-none opacity-50" : ""}`}

              />
            </PaginationItem>
            {Array.from({ length: total_pages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={current_page == i + 1} href={`?page=${i + 1}`} >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={`?page=${Number(current_page) + 1}`}
                onClick={(e) => {
                  if (current_page === total_pages)
                    e.preventDefault()
                }}
                className={`${Number(current_page) === Number(total_pages) ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

      {
        showAddModal && (
          <AddBinifiCiaryModal addBinificiary={HandleaddBinificiary} setShowAddModal={setShowAddModal} />
        )
      }
    </div>
  )
}

export default BinificiariesListing
