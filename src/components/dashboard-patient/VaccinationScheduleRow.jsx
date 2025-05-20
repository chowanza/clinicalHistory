import React from 'react'

const VaccinationScheduleRow = ({ title }) => {
  const inputStyle =
    'w-full px-1 text-center bg-transparent border-none outline-none focus:outline-none focus:ring-0 input-date-color text-sm'

  const inputContainerStyle = 'border border-fuchsia-700 w-1/5 py-2'

  return (
    <div className='flex justify-center items-center gap-4 w-full'>
      <div className='w-2/5'>
        <p className='bg-fuchsia-300 rounded-lg p-1 text-fuchsia-700 font-bold'>
          {title}
        </p>
      </div>
      <div className='w-3/5 flex justify-center items-center'>
        <div className={`rounded-bl-lg rounded-tl-lg ${inputContainerStyle}`}>
          <input className={inputStyle} type='date' />
        </div>
        <div className={inputContainerStyle}>
          <input className={inputStyle} type='date' />
        </div>
        <div className={inputContainerStyle}>
          <input className={inputStyle} type='date' />
        </div>
        <div className={inputContainerStyle}>
          <input className={inputStyle} type='date' />
        </div>
        <div className={`rounded-br-lg rounded-tr-lg ${inputContainerStyle}`}>
          <input className={inputStyle} type='date' />
        </div>
      </div>
    </div>
  )
}

export default VaccinationScheduleRow
