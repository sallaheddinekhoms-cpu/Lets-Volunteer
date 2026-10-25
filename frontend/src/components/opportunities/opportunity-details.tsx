"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {  BadgeCheck,Briefcase} from 'lucide-react';
import { Opportunity } from '@/types';

import ReturnHeader from '../return-header';
import OpportunityDetailHeader from './opportunity-detail/opportunity-detail-header';
import OpportunityDetailDescription from './opportunity-detail/opportunity-description';
import OpportunityQualificatonRespon from './opportunity-detail/opportunity-qualifcations-responsibilites';
import OrganizationCard from './opportunity-detail/opportunity-organization-card';
import ContactCard from './opportunity-detail/contact-card';
import OpportunityLocationWrapper from './opportunity-detail/opportunity-location-wrapper';
import { toast } from 'react-toastify';
import { participate } from '@/data/Participations';
import { useRouter } from 'next/navigation';


interface OrganizationDetailsProps {
      opportunity: Opportunity;
      isAuthenticated: boolean;
      is_organization : boolean;
      role?: string;
}

export default function OpportunityDetailsPage({ opportunity , isAuthenticated , is_organization, role }: OrganizationDetailsProps) {

const router = useRouter();

const handlParticipate = async (id: string) => {

      if (!isAuthenticated) {
            router.push('/auth')
            return;
      }
      if (is_organization) {
            toast.error('لا يمكنك المشاركة في الفرص بحساب جمعية  ')
            return;
      }

      toast.promise(
            participate(id),
            {
                  pending: 'جاري ارسال طلب المشاركة',
                  success: ' تم ارسال المشاركة بنجاح سيتم ابلاغك في حال تم قبولك'  ,
                  error: 'حدث خطأ اثناء المشاركة'
            }

      )


}

return (
      <div dir="rtl" className="min-h-screen bg-gray-50">
            <ReturnHeader label='العودة الى الفرص تجربة' href='/opportunities' />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="lg:col-span-2 space-y-8"
                        >
                              <OpportunityDetailHeader
                                    {...opportunity}
                                    handlParticipate={handlParticipate}
                                    
                              />


                              <OpportunityDetailDescription
                                    description={opportunity.description}
                              />



                              <OpportunityQualificatonRespon
                                    title='المسؤوليات'
                                    items={opportunity.responsabilities}
                                    IconComponent={Briefcase}
                              />



                              <OpportunityQualificatonRespon
                                    title='المؤهلات'
                                    items={opportunity.qualifications}
                                    IconComponent={BadgeCheck}
                              />


                        </motion.div>

                        <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="lg:col-span-1 space-y-8"
                        >

                              <OrganizationCard organization={opportunity.organization} />

                              <OpportunityLocationWrapper
                                    latitude={opportunity.latitude}
                                    longitude={opportunity.longitude}
                                    wilaya={opportunity.wilaya}
                                    daira={opportunity.daira}
                                    location_address={opportunity.location_address}
                              />


                              {role?.toLowerCase() === 'admin' && (
                                    <ContactCard
                                          email={opportunity.email}
                                          phone_number={opportunity.phone_number} />
                              )}


                        </motion.div>


                       
                  </div>
            </div>
      </div>
);
}