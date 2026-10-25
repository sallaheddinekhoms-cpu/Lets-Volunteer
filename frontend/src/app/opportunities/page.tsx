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

    const { data: opportunities, count } = await getOpportunities(filters)
    const { data: categories } = await getCategories()
    const wilayas = algerianWilayas.getAllWilayas()

    return (
      <OpportunitiesSection
        opportunities={opportunities}
        categories={categories}
        wilayas={wilayas}
        totalPages={Math.ceil(count / 10)}
        currentPage={filters.page || 1}
        initialViewMode={initialViewMode}
      />
    )
}

export default OpportunitiesPage;
