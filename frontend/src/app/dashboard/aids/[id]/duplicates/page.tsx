import DuplicatesList from '@/components/dashboard/aids/duplicates_list'
import { getAids, getAidType } from '@/data/Aids'
import React from 'react'




interface BeneficiariesProps {
      params: Promise<{id:string}>
    }
const DiplicatesPage:React.FC<BeneficiariesProps> = async(
      {params}:BeneficiariesProps
) => {

      const {id} = await params

      const filters = {
            is_duplicated: true,
            aid_type: Number(id)
      }

      const  {data:duplicates } = await getAids(filters)

      const {data:aid_type} = await getAidType(id)

  return (
    <DuplicatesList duplicates={duplicates} aid_type={aid_type} />
  )
}

export default DiplicatesPage
