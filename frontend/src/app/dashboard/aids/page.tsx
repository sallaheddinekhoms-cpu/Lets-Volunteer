import AdminAidTypeCard from "@/components/dashboard/aids/aid-type-card-admin"
import AddAidTypeModal from "@/components/dashboard/aids/aid-type-modal"
import { getAidsTypes } from "@/data/Aids"
import type { AidType } from "@/types/aids"

async function DashboardAidsPage() {
  try {
    const { data: aids_types } = await getAidsTypes()
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900">النشاطات الاجتماعية</h1>
                <p className="text-gray-500">إدارة وتتبع النشاطات الاجتماعية والمستفيدين</p>
              </div>
              <AddAidTypeModal />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6">
            {aids_types.map((aid: AidType, index: number) => (
              <AdminAidTypeCard key={index} aid_type={aid} />
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch aid types:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ في تحميل النشاطات الاجتماعية</h1>
          <p className="text-gray-600 mt-2">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    )
  }
}

export default DashboardAidsPage
