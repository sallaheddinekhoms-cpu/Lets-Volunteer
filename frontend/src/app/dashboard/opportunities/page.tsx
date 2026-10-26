import OpportunitiesFilter from "@/components/dashboard/opportunities/opportunities-filter";
import OpportunitiesTable from "@/components/dashboard/opportunities/opportunities-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/data/Category";
import { getOpportunities } from "@/data/Opportunities";
import { OpportunityFilters } from "@/types/filters";
import algerianWilayas from 'algeria-wilayas';
import { Plus, Handshake } from "lucide-react";
import Link from "next/link";

interface OpportunitiesPageProps {
  searchParams: Promise<OpportunityFilters>
}

export default async function OpportunitiesPage(
  { searchParams }: OpportunitiesPageProps
) {
  const filters: Partial<OpportunityFilters> = await searchParams

  const wilayas = algerianWilayas.getAllWilayas()
  let categories: any[] = []
  let opportunities: any[] = []
  let count = 0

  try {
    const resCategories = await getCategories()
    categories = Array.isArray(resCategories?.data) ? resCategories.data : []
  } catch (err) {
    console.error("Failed to fetch categories:", err)
  }

  try {
    const resOpportunities = await getOpportunities(filters)
    opportunities = Array.isArray(resOpportunities?.data) ? resOpportunities.data : []
    count = resOpportunities?.count || 0
  } catch (err) {
    console.error("Failed to fetch opportunities:", err)
  }

  return (
    <div className="space-y-4" dir="rtl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Handshake className="w-6 h-6 text-primary" />
              قائمة الفرص التطوعية
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              إدارة ونشر الفرص التطوعية ومتابعة طلبات مشاركة المتطوعين
            </p>
          </div>

          <Link href="/dashboard/opportunities/add">
            <Button className="bg-primary hover:bg-[#105D56] text-white font-bold gap-2 rounded-xl shadow-md">
              <Plus className="w-4 h-4" />
              إضافة فرصة تطوعية جديدة
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          <OpportunitiesFilter categories={categories} wilayas={wilayas} />
          <OpportunitiesTable 
            opportunities={opportunities}
            totalPages={Math.ceil(count / 10)}
            currentPage={filters.page || 1}
          />
        </CardContent>
      </Card>
    </div>
  );
}
