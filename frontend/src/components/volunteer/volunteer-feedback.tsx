import React from 'react'
import { VolunteerProfileStats } from '@/types/participation'
import { StarRating } from './volunteer-profile-stats-grid'


interface VolunteerFeedbackProps {
      volunteerData : Partial<VolunteerProfileStats>
}

const VolunteerFeedback = (
      {volunteerData}: VolunteerFeedbackProps
) => {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" dir="rtl">
      {/* Top Categories */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">المجالات المفضلة</h2>
        <div className="space-y-3">
          {volunteerData.top_categories?.map((category, index) => (
            <div
              key={index}
              className="bg-primary/5 text-primary rounded-lg px-4 py-2 inline-block"
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">آخر التقييمات</h2>
        <div className="space-y-6">
          {volunteerData.recent_feedback?.map((feedback, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{feedback.opportunity__title}</h3>
                <StarRating rating={feedback.rating} />
              </div>
              <p className="text-gray-600 text-sm mb-2">{feedback.organization_feedback}</p>
              <p className="text-gray-400 text-sm">
                {new Date(feedback.completed_at).toLocaleDateString('ar-DZ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VolunteerFeedback
