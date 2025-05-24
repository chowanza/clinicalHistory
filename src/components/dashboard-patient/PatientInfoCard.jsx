import React from 'react'
import PropTypes from 'prop-types'
import { FaPhone, FaEnvelope, FaUserShield } from 'react-icons/fa6'
import Skeleton from '@mui/material/Skeleton'

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
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <section className='w-full py-3 px-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5 flex-col'>
        {/* Skeleton para el título */}
        <div className='border-b border-gray-300 p-4'>
          <Skeleton
            variant='text'
            width={200}
            height={32}
            className='dark:bg-slate-700'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Skeleton para teléfono */}
          <div className='p-4 border-b border-gray-300'>
            <Skeleton
              variant='text'
              width={100}
              height={24}
              className='dark:bg-slate-700 mb-2'
            />
            <Skeleton
              variant='text'
              width={150}
              height={28}
              className='dark:bg-slate-700'
            />
          </div>

          {/* Skeleton para email */}
          <div className='p-4 border-b border-gray-300'>
            <Skeleton
              variant='text'
              width={100}
              height={24}
              className='dark:bg-slate-700 mb-2'
            />
            <Skeleton
              variant='text'
              width={180}
              height={28}
              className='dark:bg-slate-700'
            />
          </div>

          {/* Skeleton para contacto de emergencia */}
          <div className='p-4 col-span-2'>
            <Skeleton
              variant='text'
              width={150}
              height={24}
              className='dark:bg-slate-700 mb-2'
            />
            <Skeleton
              variant='text'
              width={250}
              height={28}
              className='dark:bg-slate-700 mb-1'
            />
            <Skeleton
              variant='text'
              width={150}
              height={28}
              className='dark:bg-slate-700'
            />
          </div>
        </div>
      </section>
    )
  }

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

PatientContact.propTypes = {
  title: PropTypes.string,
  titleIcon: PropTypes.node,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.node,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      colSpan: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
}

export default PatientContact
