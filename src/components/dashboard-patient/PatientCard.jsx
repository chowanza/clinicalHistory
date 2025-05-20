import React from 'react'

const PatientCard = ({
  patient = {
    firstNames: 'John',
    lastNames: 'Doe',
    actualAge: 30,
  },
}) => {
  return (
    <section className='w-full p-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5'>
      <div className='w-28 h-28'>
        <div className='w-full h-full bg-blue-100 border-[3px] border-blue-500 rounded-full flex items-center justify-center'>
          <span className='text-4xl text-blue-500 font-bold'>
            {patient.firstNames.charAt(0).toUpperCase()}
            {patient.lastNames.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      <div className='flex justify-between items-center flex-1'>
        <div className='flex flex-col justify-center gap-1 items-start h-full'>
          <h1 className='text-3xl font-bold text-center'>
            {patient.firstNames} {patient.lastNames}
          </h1>
          <p className='text-sm text-gray-500 flex gap-2 justify-start items-center'>
            <span>{patient.actualAge} años</span>
          </p>
        </div>
        <span className='px-2 bg-green-500 text-white rounded-2xl'>Active</span>
      </div>
    </section>
  )
}

export default PatientCard
