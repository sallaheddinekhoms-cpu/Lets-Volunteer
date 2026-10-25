import OrganizationTable from "@/components/dashboard/organizations/organization-table";
import { getOrganizations } from "@/data/admin/Organizatons";
import { OrganizationFilters } from "@/types/filters";
import algerianWilayas from 'algeria-wilayas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrganizationFilter from "@/components/dashboard/organizations/organization-filter";


interface OrganizationsPageProps {
  searchParams: Promise<OrganizationFilters>
}

export default async function OrganizationsPage(
  { searchParams }: OrganizationsPageProps
) {

  const filters: Partial<OrganizationFilters> = await searchParams

  const { results: organization, count } = await getOrganizations(filters)

  const wilayas = algerianWilayas.getAllWilayas()
  const dairas = algerianWilayas.getDairasByWilaya(filters.wilaya || '01')
  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة الهيئات</CardTitle>
      </CardHeader>
      <CardContent>
        <OrganizationFilter
          dairas={dairas}
          wilayas={wilayas}
          isWilayaSelected={!!filters.wilaya}

        />
        <OrganizationTable
          currentPage={filters.page || 1}
          totalPages={Math.ceil(count / 10)}
          organizations={organization}
          wilayas={wilayas}
        />
      </CardContent>
    </Card>

  );
}