import { Suspense } from "react"
import EditOpportunityForm from "@/components/opportunities/forms/edit-opportunity"
import { getCategories } from "@/data/Category"
import { Loader2 } from "lucide-react"


interface EditOpportunityPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditOpportunityPage({ params }: EditOpportunityPageProps) {
  const { id } = await params
  const { data: categories = [] } = await getCategories()

  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen" dir="rtl">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">جاري تحميل نموذج التعديل...</p>
          </div>
        </div>
      }
    >
      <EditOpportunityForm categories={categories} opportunityId={id} />
    </Suspense>
  )
}