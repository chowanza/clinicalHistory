import React from 'react'
import PropTypes from 'prop-types'
import { FaPhone, FaEnvelope, FaUserShield } from 'react-icons/fa6'

const PatientContact = ({
  title = 'Contact Information',
  titleIcon = <FaUserShield />,
  sections = [
    {
      title: 'Phone',
      icon: <FaPhone />,
      content: '123-456-7890',
      colSpan: 1,
    },
    {
      title: 'Email',
      icon: <FaEnvelope />,
      content: 'patient@example.com',
      colSpan: 1,
    },
    {
      title: 'Emergency Contact',
      icon: <FaUserShield />,
      content: 'John Doe (Father)\n555-123-4567',
      colSpan: 2,
    },
  ],
}) => {
  return (
    <section className='w-full py-3 px-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5 flex-col'>
      <h2 className='flex justify-start items-center gap-1 text-secondary border-b border-gray-300 p-4 font-semibold text-xl'>
        {titleIcon} {title}
      </h2>
      <div className='grid grid-cols-2 gap-4'>
        {sections.map((section, index) => (
          <div
            key={index}
            className={`p-4 ${
              index < sections.length - 1 ? 'border-b border-gray-300' : ''
            }`}
            style={{ gridColumn: `span ${section.colSpan || 1}` }}
          >
            <span className='text-gray-500 flex justify-start items-center gap-1'>
              {section.icon} {section.title}
            </span>
            {typeof section.content === 'string' ? (
              section.content.split('\n').map((line, i) => (
                <p
                  key={i}
                  className='text-text-light dark:text-text-dark font-semibold'
                >
                  {line}
                </p>
              ))
            ) : (
              <div className='text-text-light dark:text-text-dark font-semibold'>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default PatientContact
