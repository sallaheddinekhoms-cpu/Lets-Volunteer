import { Volunteer } from '@/types'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail} from 'lucide-react';
import algerianWilayas from 'algeria-wilayas';
  



interface VolunteerProfileHeaderProps {
      volunteerData: Partial<Volunteer>
}

const VolunteerProfileHeader = (
      {volunteerData}: VolunteerProfileHeaderProps
) => {
  return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8" dir="rtl">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          {/* <span className="text-3xl font-bold text-primary">
            {volunteerData.first_name[0]}{volunteerData.last_name[0]}
          </span> */}
          <Avatar className="w-32 h-32">
            <AvatarImage src={typeof volunteerData.avatar === 'string' ? volunteerData.avatar : undefined} />
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {volunteerData.first_name} {volunteerData.last_name}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>{volunteerData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>{volunteerData.phone_number}</span>
            </div>
            {volunteerData.wilaya && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{algerianWilayas.getWilayaByCode(volunteerData.wilaya)?.name.arabic || "غير محدد" },{volunteerData.daira}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerProfileHeader
