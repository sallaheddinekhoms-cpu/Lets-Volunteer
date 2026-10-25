import React from 'react'
import {motion } from 'framer-motion'
interface ContactCardProps {
      email? : string
      phone_number? : string
}
import { Mail, Phone } from 'lucide-react';

const ContactCard:React.FC<ContactCardProps> = (
      {email, phone_number}
) => {
  return (
    <motion.div
    initial={{ opacity: 0 ,x : 20 }}
    animate={{ opacity: 1 , x : 0 }}
  
    >
      <div  className='bg-white rounded-xl space-y-4 shadow-sm p-6'>
        <h3 className='text-xl font-semibold text-gray-900'>تواصل</h3>
          <div className='flex items-center' >
            <Mail className='w-5 h-5 text-primary' />
            <span className='text-gray-600 mr-2'>{email}</span>
          </div>

          <div className='flex items-center' >
            <Phone className='w-5 h-5 text-primary' />
            <span className='text-gray-600 mr-2'>{phone_number}</span>
          </div>
        


      </div>



    </motion.div>
  )
}

export default ContactCard
