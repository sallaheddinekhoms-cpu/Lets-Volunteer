import React from 'react'
import { motion } from 'framer-motion';
interface OpportunityDetailDescriptionProps {
      description: string;
}

const OpportunityDetailDescription:React.FC<OpportunityDetailDescriptionProps> = (
      {description}
) => {
      return (
            <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm p-6"
            >
                  <h2 className="text-xl font-semibold mb-4">الوصف</h2>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
            </motion.div>
      )
}

export default OpportunityDetailDescription
