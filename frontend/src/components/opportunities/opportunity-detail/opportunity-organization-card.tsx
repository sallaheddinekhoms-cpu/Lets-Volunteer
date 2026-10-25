import { Organization } from '@/types'
import React from 'react'
import { motion } from 'framer-motion'
interface OrganizationCardProps {
      organization : Organization
}
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const OrganizationCard:React.FC<OrganizationCardProps> = ({organization}) => {
  return (
      <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
>
      <div className="bg-primary rounded-xl shadow-sm px-6 py-3">
            <div className="flex flex-col gap-2 items-center space-x-reverse space-x-4">
                        <Avatar>
                        <AvatarImage sizes='2xl' src={organization.logo} alt={organization.organization_name} />
                        <AvatarFallback>
                             
                        </AvatarFallback>
                        </Avatar>
                  <div>
                        <h3 className="font-semibold text-white text-lg">{organization.organization_name}</h3>
                  
                  </div>
            </div>
      </div>
</motion.div>
  )
}

export default OrganizationCard
