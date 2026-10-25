import { AidType } from '@/types/aids'
import React from 'react'

import { Calendar, Users, ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';


interface AidTypeCardProps {
  aid_type: AidType

}

const AidTypeCard:React.FC<AidTypeCardProps> = ({aid_type}) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{aid_type.label}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${aid_type.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {aid_type.is_open ? 'مفتوح' : 'مغلق'}
              </span>
            </div>
          </div>
          <p className="text-gray-600">{aid_type.description}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span>{aid_type.year}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-5 h-5" />
              <span>{aid_type.beneficiary_count} مستفيد</span>
            </div>
          </div>
        </div>
        {aid_type.is_open &&<Link  href={`/aids/${aid_type.id}`}
          className="flex items-center gap-2 text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
        >
          عرض المستفيدين
          <ArrowRight className="w-5 h-5" />
        </Link>}
      </div>
    </div>
  )
}

export default AidTypeCard
