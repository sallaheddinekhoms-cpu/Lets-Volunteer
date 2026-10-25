import React from 'react';
import { getAids, getAidType } from '@/data/Aids';
import BinificiariesListing from '@/components/aids/binificiaries-list';
import { AidsFilters } from '@/types/filters';

interface BeneficiariesProps {
  params: Promise<{id:string}>
  searchParams? : Promise<AidsFilters>
}

async function Beneficiaries(
  {params, searchParams}: BeneficiariesProps
) {
  const {id} = await params
  const page = (await searchParams)?.page
  const identity = (await searchParams)?.identity

  const filters: AidsFilters = {
    page: page || 1,
    aid_type: Number(id),
    identity: identity
  }
  
  const {data: beneficaires, count} = await getAids(filters)

  const {data:aid_type} = await getAidType(id)

  
  return (
    <div className="space-y-8">

      
      

      <BinificiariesListing 
        binificiaries={beneficaires} 
        aid_type={aid_type} 
        current_page={page || 1}
        total_pages={Math.ceil(count / 10)}
        total_items={count}
      />
    </div>
  );
}

export default Beneficiaries;