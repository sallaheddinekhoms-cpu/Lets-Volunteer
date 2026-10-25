"use client"
import OrganizationInfo from "@/components/organization/organization-infos";
import { OrganizationProfile } from "@/types/organization";
import { OpportunityForCardList } from "@/types/opportunity";
import OrganizationProfileOpportunitiesSection from "@/components/opportunities/organization-opportunities/organization-profile-opportunities";
import BackgroundDecorations from "@/components/background-decorations";
import { useState } from "react";
import EditOrganizationModal from "@/components/modals/edit-organization";
import { toast } from "react-toastify";
import { updateOrganization } from "@/data/Organization";
import algerianWilayas from 'algeria-wilayas';

interface OrganizationProfileProps {
  organization: OrganizationProfile;
  opportunities: OpportunityForCardList[];
}

export function OrganizationProfileSection({ organization, opportunities }: OrganizationProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  console.log("organization", organization.logo);

  const handleSave = async (updatedOrganization: FormData) => {
    try {
      toast.promise(updateOrganization(updatedOrganization) , 
        {
          pending: 'تعديل معلومات الجمعية...',
          success: 'تم تعديل معلومات الجمعية بنجاح',
          error: 'حدث خطأ أثناء تعديل معلومات الجمعية'  
        }
    
    
    )
      // router.refresh();
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const wilayas = algerianWilayas.getAllWilayas();
  const dairas = algerianWilayas.getDairasByWilaya(organization.wilaya || '01');

  return (
    <div className="relative min-h-screen bg-background/50 pb-16" dir="rtl">
      <BackgroundDecorations>
        <EditOrganizationModal 
          organization={organization} 
          open={isEditing}
          onOpenChange={setIsEditing}
          onSave={handleSave}
          wilayas={wilayas}
          dairas={dairas}
        />
        <div className="container mx-auto px-4 relative z-10">
          <OrganizationInfo 
            organization={organization} 
            onEditIcon={setIsEditing}
          />
          <OrganizationProfileOpportunitiesSection 
            opportunities={opportunities} 
          />
        </div>
      </BackgroundDecorations>
    </div>
  );
}

export default OrganizationProfileSection;