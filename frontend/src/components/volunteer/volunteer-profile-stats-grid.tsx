import { VolunteerProfileStats } from '@/types/participation'
import React from 'react'
import {Star,  Award, Clock, BarChart3 } from 'lucide-react';



export function StarRating({ rating = 0 }: { rating?: number }) {
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      );
    }

interface VolunteerProfileStatsGridProps {
      volunteerData : Partial<VolunteerProfileStats>
}

const VolunteerProfileStatsGrid = (
      {volunteerData}: VolunteerProfileStatsGridProps
) => {
  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" dir="rtl">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">ساعات التطوع</p>
            <p className="text-2xl font-bold text-gray-900">{volunteerData.total_hours}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">متوسط التقييم</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{volunteerData.average_rating}</p>
              <StarRating rating={volunteerData.average_rating} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">نسبة المشاركة</p>
            <p className="text-2xl font-bold text-gray-900">{volunteerData.participation_rate}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerProfileStatsGrid
