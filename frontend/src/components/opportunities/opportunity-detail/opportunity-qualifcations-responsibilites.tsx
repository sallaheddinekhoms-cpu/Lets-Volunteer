import React from 'react'
import { motion } from 'framer-motion';
interface OpportunityQualificatonResponProps {
      title: string;
      items: { title: string }[];
      IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;

}


const OpportunityQualificatonRespon: React.FC<OpportunityQualificatonResponProps> = (
      { title, items , IconComponent }
) => {
  return (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-xl shadow-sm p-6"
>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
            <IconComponent className="w-5 h-5 ml-2 text-gray-600" />
            {title}
      </h2>
      <ul className="space-y-3">
            {items.map((item,key) => (
                  <li key={key} className="flex items-start">
                        <IconComponent className="w-5 h-5 ml-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{item.title}</span>
                  </li>
            ))}
      </ul>
</motion.div>
  )
}

export default OpportunityQualificatonRespon
