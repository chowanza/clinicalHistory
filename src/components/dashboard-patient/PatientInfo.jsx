import React from 'react'
import {
  FaUser,
  FaCalendarDays,
  FaSyringe,
  FaHouse,
  FaAddressCard,
  FaFlag,
  FaHeart,
  FaHammer,
} from 'react-icons/fa6'
import { FaBirthdayCake, FaMale, FaFemale } from 'react-icons/fa'

const PatientInfo = ({ patient }) => {
  return (
    <section className='w-full py-3 px-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5 flex-col'>
      <h2 className='flex justify-start items-center gap-1 text-secondary border-b border-gray-300 p-4 font-semibold text-xl'>
        <FaUser /> Personal Information
      </h2>
      <div className='grid grid-cols-2 gap-4'>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaCalendarDays />
            Birth Date
          </span>
          <p className='text-text-light font-semibold'>{patient.birthDate}</p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaBirthdayCake />
            Age
          </span>
          <p className='text-text-light font-semibold'>{patient.age}</p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            {patient.gender === 'Male' ? (
              <FaMale />
            ) : patient.gender === 'Female' ? (
              <FaFemale />
            ) : (
              ''
            )}
            Gender
          </span>
          <p className='text-text-light font-semibold'>{patient.gender}</p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaHeart />
            Marital Status
          </span>
          <p className='text-text-light font-semibold'>
            {patient.maritalStatus}
          </p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaHammer />
            Occupation
          </span>
          <p className='text-text-light font-semibold'>{patient.occupation}</p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaFlag />
            Nationality
          </span>
          <p className='text-text-light font-semibold'>{patient.nationality}</p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaHouse />
            Adress
          </span>
          <p className='text-text-light font-semibold'>{patient.address}</p>
        </div>
        <div className='p-4 border-b border-gray-300'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaSyringe />
            Blood Type
          </span>
          <p className='text-text-light font-semibold'>{patient.bloodType}</p>
        </div>
        <div className='p-4'>
          <span className='text-gray-500 flex justify-start items-center gap-1'>
            <FaAddressCard />
            DNI
          </span>
          <p className='text-text-light font-semibold'>{patient.dni}</p>
        </div>
      </div>
    </section>
  )
}

export default PatientInfo
