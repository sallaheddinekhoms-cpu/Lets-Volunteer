import { Organization } from '@/types'
import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ShieldCheck, Star, Award, HeartHandshake } from 'lucide-react'

interface OrganizationCardProps {
  organization: Organization
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const impact = organization.impact;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="bg-gradient-to-br from-[#006D5B] to-[#004D40] text-white rounded-2xl shadow-md p-5 border border-emerald-700/40">
        <div className="flex items-center gap-3.5">
          <Avatar className="h-14 w-14 border-2 border-amber-400 bg-white shadow-sm shrink-0">
            <AvatarImage src={organization.logo} alt={organization.organization_name} />
            <AvatarFallback className="bg-emerald-800 text-white font-bold">
              {organization.organization_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> هيئة معتمدة (قانون 12-06)
              </span>
            </div>
            <h3 className="font-extrabold text-white text-base leading-snug">
              {organization.organization_name}
            </h3>
          </div>
        </div>

        {/* Civic Impact Tier & Badges */}
        <div className="mt-4 pt-3 border-t border-emerald-500/30 space-y-2 text-xs">
          <div className="flex items-center justify-between text-emerald-100">
            <span>تصنيف الهيئة في المؤشر الوطني:</span>
            <span className="font-bold text-amber-300">
              {impact?.tier_label || "هيئة رائدة في العمل التطوعي"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="bg-white/15 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              صديقة المتطوعين ({impact?.avg_volunteer_rating ? Number(impact.avg_volunteer_rating).toFixed(1) : "5.0"})
            </span>
            <span className="bg-white/15 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-300" />
              {impact?.impact_points || 45} نقطة أثر
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default OrganizationCard
