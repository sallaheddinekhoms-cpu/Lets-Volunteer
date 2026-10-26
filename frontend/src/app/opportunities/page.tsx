import { OpportunitiesSection } from '@/components/opportunities/opportunities-section';
import { getCategories } from '@/data/Category';
import { getOpportunities } from '@/data/Opportunities';
import { OpportunityFilters } from '@/types/filters';
import algerianWilayas from 'algeria-wilayas';

export const dynamic = 'force-dynamic'

interface OpportunitiesPageProps {
  searchParams : Promise<OpportunityFilters & { view?: string }>
}

const OpportunitiesPage: React.FC<OpportunitiesPageProps> = async ({searchParams}) => {
    const filters = await searchParams
    const initialViewMode = filters?.view === "map" ? "map" : "grid"

    const oppsResult = await getOpportunities(filters)
    const catResult = await getCategories()
    const wilayas = Array.isArray(algerianWilayas.getAllWilayas()) ? algerianWilayas.getAllWilayas() : []

    const opportunities = Array.isArray(oppsResult?.data) ? oppsResult.data : []
    const categories = Array.isArray(catResult?.data) ? catResult.data : []
    const count = typeof oppsResult?.count === 'number' ? oppsResult.count : opportunities.length
    const totalPages = Math.max(1, Math.ceil(count / 10))

    return (
      <OpportunitiesSection
        opportunities={opportunities}
        categories={categories}
        wilayas={wilayas}
        totalPages={totalPages}
        currentPage={Number(filters?.page) || 1}
        initialViewMode={initialViewMode}
      />
    )
}

export default OpportunitiesPage;
