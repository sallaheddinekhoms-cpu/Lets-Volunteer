import VolunteersTable from "@/components/dashboard/volunteers/volunteers-table";
import { getVolunteers } from "@/data/admin/Volunteers";
import { VolunteerFilters } from "@/types/filters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VolunteersFilter from "@/components/dashboard/volunteers/volunteers-filter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface VolunteerPageProps {
  searchParams: Promise<VolunteerFilters>
}
import algerianWilayas from 'algeria-wilayas';

export default async function VolunteersPage(
  { searchParams }: VolunteerPageProps
) {
  const filters: Partial<VolunteerFilters> = await searchParams;
  const { results: volunteers, count } = await getVolunteers(filters);
  const wilayas = algerianWilayas.getAllWilayas();
  const dairas = algerianWilayas.getDairasByWilaya(filters.wilaya || '01');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>قائمة المتطوعين</CardTitle>
        <Link href="/dashboard/volunteers/import">
          <Button className="text-white">
            <Upload className="h-4 w-4 mr-2" />
            استيراد المتطوعين
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <VolunteersFilter
          dairas={dairas}
          wilayas={wilayas}
          isWilayaSelected={!!filters.wilaya}
        />
        <VolunteersTable 
          volunteers={volunteers} 
          currentPage={filters.page || 1}
          totalPages={Math.ceil(count / 10)}
        />
      </CardContent>
    </Card>
  );
}