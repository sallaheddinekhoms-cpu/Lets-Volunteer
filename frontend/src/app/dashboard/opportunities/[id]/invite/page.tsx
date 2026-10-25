
import VolunteersFilter from '@/components/dashboard/volunteers/volunteers-filter'
import InviteVolunteersTable from '@/components/dashboard/volunteers/volunteers-to-invite-table'
import { getVolunteers } from '@/data/admin/Volunteers'
import { VolunteerFilters } from '@/types/filters'
import algerianWilayas from 'algeria-wilayas';


interface VolunteerPageProps {
  searchParams: Promise<VolunteerFilters>
  params : Promise<{id:string}>
}
const InviteVolunteersPage: React.FC<VolunteerPageProps> = async (
  { searchParams , params }: VolunteerPageProps 
) => {
 
  const filters: Partial<VolunteerFilters> = await searchParams;

  const {id} = await params

  const { results: volunteers, count } = await getVolunteers(filters);

  const wilayas = algerianWilayas.getAllWilayas();
  const dairas = algerianWilayas.getDairasByWilaya(filters.wilaya || '01');


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-right">دعوة متطوعين</h1>
      
      <VolunteersFilter 
      wilayas={wilayas}
      dairas={dairas}
      isWilayaSelected={!!filters.wilaya}
      />
      
      <InviteVolunteersTable
        opportunityId={id}
        volunteers={volunteers}
        currentPage={filters.page || 1}
        totalPages={Math.ceil(count / 10)}
      />
    </div>
  )
}

export default InviteVolunteersPage