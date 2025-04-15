import React from 'react'
import { FaPhone, FaEnvelope, FaUserShield } from 'react-icons/fa6'

const PatientContact = ({ contact }) => {
  return (
    <section className='w-full py-3 px-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5 flex-col'>
      <h2 className='flex justify-start items-center gap-1 text-secondary border-b border-gray-300 p-4 font-semibold text-xl'>
        <FaUserShield /> Contact Information
      </h2>
      <div className='grid grid-cols-2 gap-4'>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaPhone />
            Phone
          </span>
          <p className='text-text-light font-semibold'>{contact.phone}</p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaEnvelope />
            Email
          </span>
          <p className='text-text-light font-semibold'>{contact.email}</p>
        </div>
        <div className='col-span-2 p-4'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaUserShield />
            Emergency Contact
          </span>
          <p className='text-text-light font-semibold'>
            {contact.emergencyContact.name} (
            {contact.emergencyContact.relationship})
          </p>
          <p className='text-text-light font-semibold'>
            {contact.emergencyContact.phone}
          </p>
        </div>
      </div>
    </section>
  )
}

export default PatientContact
