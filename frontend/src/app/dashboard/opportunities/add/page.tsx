import AddOpportunityForm from "@/components/opportunities/forms/add-opportunity";
import { getCategories } from "@/data/Category";
import { getOrganizations } from "@/data/admin/Organizatons";
import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function AdminAddOpportunityPage() {
  try {
    let categories: any[] = [];
    let organizationsList: any[] = [];

    try {
      const catRes = await getCategories();
      categories = Array.isArray(catRes?.data) ? catRes.data : [];
    } catch (e) {
      console.error("Failed to load categories in admin add opportunity:", e);
    }

    try {
      const organizationsData = await getOrganizations({ page: 1 });
      organizationsList = (organizationsData?.results || []).map((org) => ({
        id: org.id,
        organization_name: org.organization_name,
      }));
    } catch (e) {
      console.error("Failed to load organizations in admin add opportunity:", e);
    }

    return (
      <div className="space-y-6 max-w-5xl mx-auto py-4" dir="rtl">
        {/* Top Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-card rounded-2xl border border-border shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              لوحة التحكم الإدارية
            </div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Handshake className="w-6 h-6 text-primary" />
              إضافة فرصة تطوعية جديدة
            </h1>
            <p className="text-xs text-muted-foreground">
              يمكنك كمسؤول نشر الفرصة باسم المنصة الوطنية أو تعيينها لإحدى الهيئات والجمعيات المسجلة.
            </p>
          </div>

          <Link href="/dashboard/opportunities">
            <Button variant="outline" className="gap-2 text-xs font-semibold">
              <ArrowRight className="w-4 h-4" />
              العودة لقائمة الفرص
            </Button>
          </Link>
        </div>

        {/* Opportunity Creation Form */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <AddOpportunityForm
            categories={categories || []}
            organizations={organizationsList}
            redirectUrl="/dashboard/opportunities"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("AdminAddOpportunityPage error:", error);
    return (
      <div className="p-8 text-center" dir="rtl">
        <p className="text-destructive font-bold">حدث خطأ أثناء تحميل نموذج إضافة الفرصة</p>
        <Link href="/dashboard/opportunities" className="mt-4 inline-block">
          <Button variant="outline">العودة للوحة التحكم</Button>
        </Link>
      </div>
    );
  }
}
