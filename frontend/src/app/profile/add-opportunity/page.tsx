import AddOpportunityForm from "@/components/opportunities/forms/add-opportunity";
import { getCategories } from "@/data/Category";
import { getCurrentUserOrganizationId } from "@/utils/permissions";
import { getAccessTokenInfo } from "@/utils/auth";
import { getOrganizationProfileInfoById } from "@/data/Organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function AddOpportunityPage() {
  try {
    const { data: categories } = await getCategories();
    
    // Check if user is Admin or Organization
    const tokenInfo = await getAccessTokenInfo();
    const isAdmin = tokenInfo?.role === 'ADMIN';

    if (isAdmin) {
      return (
        <div className="container mx-auto px-4 py-8" dir="rtl">
          <AddOpportunityForm categories={categories || []} />
        </div>
      );
    }

    // Get current organization info
    const organizationId = await getCurrentUserOrganizationId();
    
    if (!organizationId) {
      return (
        <div className="container mx-auto px-4 py-8" dir="rtl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>الوصول مرفوض</AlertTitle>
            <AlertDescription>
              يجب تسجيل الدخول كمسؤول أو كمنظمة معتمدة للوصول إلى هذه الصفحة.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    const { data: organization } = await getOrganizationProfileInfoById(organizationId);
    
    // Check if organization is confirmed
    if (organization && !organization.is_confirmed) {
      return (
        <div className="container mx-auto px-4 py-8" dir="rtl">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                منظمتك قيد المراجعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-right">
                  منظمتك قيد المراجعة من قبل المسؤولين. لن تتمكن من إضافة فرص تطوعية حتى يتم تأكيد منظمتك.
                </p>
                <p className="text-sm text-muted-foreground text-right">
                  سيتم إخطارك عبر البريد الإلكتروني عند تأكيد منظمتك.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
 
    return (
      <AddOpportunityForm categories={categories || []} />
    );
  } catch (error) {
    console.error('Page rendering error:', error);
    return <div className="container mx-auto px-4 py-8" dir="rtl">خطأ في تحميل الصفحة</div>;
  }
}
