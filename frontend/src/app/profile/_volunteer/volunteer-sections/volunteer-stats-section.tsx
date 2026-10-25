"use climport { StarRating } from \"@/components/ui/custom/start-rating\"\nimport { CardTierDisplay } from \"@/components/ui/custom/card-tier-display\"ent"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BarChart2, Calendar, Clock, Target, TrendingUp } from "lucide-react"
import { StarRating } from "@/components/ui/custom/start-rating"
import { CardTierDisplay } from "@/components/ui/custom/card-tier-display"

interface VolunteerStats {
  id: string
  total_hours: number
  average_rating: number
  participation_rate: number
  top_categories: string[]
  recent_feedback: {
    organization_feedback: string
    rating: number
    opportunity__title: string
    completed_at: string
  }[]
}

interface VolunteerStatsProps {
  stats: VolunteerStats
}

export const VolunteerStatsSection: React.FC<VolunteerStatsProps> = ({ stats }) => {
  // Format date to Arabic locale
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error parsing date:", error)
      return "تاريخ غير متاح"
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="border-primary/10 shadow-md bg-gradient-to-b from-white to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold text-primary-foreground flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            إحصائيات التطوع
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Card Tier Display */}
          <CardTierDisplay totalHours={stats.total_hours} className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center justify-center text-center"
            >
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="text-sm font-medium text-blue-700 mb-1">ساعات التطوع</h3>
              <p className="text-3xl font-bold text-blue-800">{stats.total_hours}</p>
              <p className="text-xs text-blue-600 mt-1">ساعة</p>
            </motion.div>

            {/* Average Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex flex-col items-center justify-center text-center"
            >
              <Award className="w-8 h-8 text-yellow-600 mb-2" />
              <h3 className="text-sm font-medium text-yellow-700 mb-1">متوسط التقييم</h3>
              <p className="text-3xl font-bold text-yellow-800">{stats.average_rating.toFixed(1)}</p>
              <div className="mt-1">
                <StarRating initialRating={stats.average_rating} readOnly />
              </div>
            </motion.div>

            {/* Participation Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center justify-center text-center"
            >
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="text-sm font-medium text-green-700 mb-1">معدل المشاركة</h3>
              <p className="text-3xl font-bold text-green-800">{stats.participation_rate}%</p>
              <p className="text-xs text-green-600 mt-1">من الفرص المتاحة</p>
            </motion.div>

            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex flex-col items-center justify-center text-center"
            >
              <Target className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="text-sm font-medium text-purple-700 mb-1">أهم المجالات</h3>
              <div className="mt-1">
                {stats.top_categories.length > 0 ? (
                  stats.top_categories.map((category, index) => (
                    <p key={index} className="text-lg font-bold text-purple-800">
                      {category}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-purple-600">لا توجد مجالات بعد</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Feedback */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>آخر التقييمات</span>
            </h3>
            {stats.recent_feedback && stats.recent_feedback.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_feedback.map((feedback, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="bg-white p-4 rounded-lg border border-primary/10 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-primary">{feedback.opportunity__title}</h4>
                      <StarRating initialRating={feedback.rating} readOnly />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">&quot;{feedback.organization_feedback}&quot;</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(feedback.completed_at)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">لا توجد تقييمات حتى الآن</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VolunteerStatsSection
