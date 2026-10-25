import React, { useState } from 'react'
import { MapPin, Building2, Timer } from 'lucide-react';
import { format, formatDistanceToNow } from "date-fns";
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useAuthRole } from '@/hooks/useAuthRole';
import OpportunityModalActivationEdit from '@/components/dashboard/opportunities/opportunity-activate-modal';
import { toast } from 'react-toastify';
import { updateOpportunity } from '@/data/Opportunities';
import algerianWilayas from 'algeria-wilayas';

interface OpportunityDetailHeaderProps {
      id: string;
      title: string;
      organization: {
            organization_name: string;
      };
      wilaya: string;
      daira: string;
      is_urgent: boolean;
      is_remote?: boolean;
      category: {
            label: string;
      }
      duration?: number;
      date_of_opportunity?: string;
      created_at: string;
      updated_at: string;
      is_available: boolean;
      already_applied?: boolean;
      is_active?: boolean;
      handlParticipate: (id: string) => void;
      


}

const OpportunityDetailHeader: React.FC<OpportunityDetailHeaderProps> = (
      { id, title, organization, wilaya, daira, is_urgent,
            is_remote, category, duration, date_of_opportunity, created_at, updated_at,
            is_available, already_applied,is_active, handlParticipate }
) => {
      const { hasPermission: isAdmin, isLoading } = useAuthRole('admin');
      const [showActivationChangingStatus , setshowActivationChangingStatus] = useState(false);

      // Helper function to get wilaya name from code
      const getWilayaName = (code: string) => {
            const wilaya = algerianWilayas.getWilayaByCode(code);
            return wilaya ? wilaya.name.arabic : code;
      };


      const handleEdit = async () => {
      
                  if (id) {
                        if(is_active){
                              toast.promise(
                                    updateOpportunity(id,{is_active:false}),
                                    {
                                          pending: 'جاري تعطيل الفرصة التطوعية',
                                          success: 'تم تعطيل الفرصة التطوعية بنجاح',
                                          error: 'حدث خطأ اثناء تعطيل الفرصة التطوعية'
                                    }
                              );
      
                        }else{
                              toast.promise(
                                    updateOpportunity(id,{is_active:true}),
                                    {
                                          pending: 'جاري تفعيل الفرصة التطوعية',
                                          success: 'تم تفعيل الفرصة التطوعية بنجاح',
                                          error: 'حدث خطأ اثناء تفعيل الفرصة التطوعية'
                                    }
                              );
                        }
                        
                  }
                  setshowActivationChangingStatus(false);
             }

      return (
            <div className='bg-white rounded-xl shadow-sm p-6  flex items-center justify-between'>


                  <div className="space-y-4">
                        <div className="flex items-start justify-between">
                              <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                                          <span className="flex items-center">
                                                <Building2 className="w-4 h-4 ml-1" />
                                                {organization.organization_name}
                                          </span>
                                          <span className="flex items-center">
                                                <MapPin className="w-4 h-4 ml-1" />
                                                {getWilayaName(wilaya)}، {daira}
                                          </span>
                                    </div>
                              </div>
                              {is_urgent && (
                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                          عاجل
                                    </span>
                              )}
                        </div>


                        <div className="flex flex-wrap gap-2">
                              {is_remote && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                          عن بعد
                                    </span>
                              )}
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                    {category.label}
                              </span>
                              {duration ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                                          <Timer className="w-4 h-4 ml-1" />
                                          {duration} يوم
                                    </span>
                              ) : "غير محدد"
                              }
                        </div>

                        <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                                    موعد انطلاق المبادرة   :{" "}
                                    <span>
                                          {date_of_opportunity && format(new Date(date_of_opportunity), 'PPP', { locale: ar })}
                                          {" "}
                                          <span className="text-muted-foreground/60">
                                                ({date_of_opportunity && formatDistanceToNow(new Date(date_of_opportunity), { locale: ar, addSuffix: true })})
                                          </span>
                                    </span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                    نشر  بتاريخ :{" "}
                                    <span>
                                          {format(new Date(created_at), 'PPP', { locale: ar })}
                                          {" "}
                                          <span className="text-muted-foreground/60">
                                                ({formatDistanceToNow(new Date(created_at), { locale: ar, addSuffix: true })})
                                          </span>
                                    </span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                    {updated_at !== created_at && (
                                          <div>
                                                تم التحديث بتاريخ :{" "}
                                                <span>
                                                      {format(new Date(updated_at), 'PPP', { locale: ar })
                                                      }{" "}
                                                      <span className="text-muted-foreground/60">
                                                            ({formatDistanceToNow(new Date(updated_at), { locale: ar, addSuffix: true })})
                                                      </span>
                                                </span>
                                          </div>
                                    )}

                              </div>
                        </div>



                  </div>
                  {isAdmin ? (
                        <Button onClick={()=>{setshowActivationChangingStatus(true)}} variant={is_active ? "destructive" : "default"} className="w-1/4 text-white" >
                              {is_active? "تعطيل الفرصة" : "تفعيل الفرصة"}
                        </Button>
                  ) :
                        (
                              <Button aria-disabled={isLoading} onClick={() => { handlParticipate(id) }} disabled={!is_available || already_applied || isLoading} className="w-1/4 bg-primary text-white px-2 py-4 rounded-lg hover:bg-primary/90 transition-colors">
                                    {is_available ? (already_applied ? "تم التقديم من قبل" : "تقديم") : "غير متاح"}
                              </Button>
                        )

                  }

                  <OpportunityModalActivationEdit
                        showActivationChangingStatus={showActivationChangingStatus}
                        setshowActivationChangingStatus={setshowActivationChangingStatus}
                        handleChangeActivationStatus={handleEdit}
                  />
            </div>
      )
}

export default OpportunityDetailHeader
