
import VolunteerImport from "@/components/dashboard/volunteers/volunteer-import";

export default function ImportVolunteersPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">استيراد المتطوعين</h1>
      <VolunteerImport />
    </div>
  );
}