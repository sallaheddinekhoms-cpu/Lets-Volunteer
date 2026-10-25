"use client"


import { Button } from "@/components/ui/button"
import { ArrowRight, UserX } from "lucide-react"
import Link from "next/link"
import type { AidType } from "@/types/aids"




export default function DuplicatesList(
      { duplicates , aid_type } : { duplicates: any[] , aid_type: AidType }
) {
 


  if (!aid_type) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-600 mb-4">لم يتم العثور على النشاط المطلوب</p>
        <Button asChild>
          <Link href="/aids">العودة إلى قائمة الأنشطة</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المستفيدين المكررين</h1>
          <p className="text-gray-600 mt-1">
            {aid_type.label} - {aid_type.year}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/aids/`} className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            العودة  
          </Link>
        </Button>
      </div>

      {duplicates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">لا يوجد مستفيدين مكررين</h2>
          <p className="text-gray-500 max-w-md mx-auto">لم يتم العثور على أي تكرار في قائمة المستفيدين لهذا النشاط.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الاسم</th> */}
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">رقم الهوية</th>
                {/* <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">عدد التكرارات</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {duplicates.map((duplicate) => (
                <tr key={duplicate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{duplicate.identity}</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-600">{duplicate.nationalId}</td> */}
                  {/* <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {duplicate.duplicateCount} مرات
                    </span>
                  </td> */}
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
