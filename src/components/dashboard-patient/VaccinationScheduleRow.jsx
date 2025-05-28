import { useState, useEffect } from 'react'

const VaccinationScheduleRow = ({
  title,
  rowIndex,
  setVaccination,
  setVaccinationWasUpdated,
  vaccinationData,
}) => {
  const [dates, setDates] = useState(['', '', '', '', ''])
  const inputStyle =
    'w-full px-1 text-center bg-transparent border-none outline-none focus:outline-none focus:ring-0 input-date-color text-sm'

  const inputContainerStyle = 'border border-fuchsia-700 w-1/5 py-2'

  const validDoseTypes = ['dose1', 'dose2', 'dose3', 'booster1', 'booster2']

  useEffect(() => {
    if (vaccinationData?.doses) {
      const newDates = [...dates]
      validDoseTypes.forEach((doseType, index) => {
        const isoDate = vaccinationData.doses[doseType]
        if (isoDate) {
          newDates[index] = isoDate.split('T')[0] // cambiar de formato ISO a YYYY-MM-DD
        }
      })
      setDates(newDates)
    }
  }, [vaccinationData])

  const handleSetVaccination = (newDates, doseType) => {
    setVaccination((prev) => ({
      vaccineName: title,
      doseType: validDoseTypes[doseType],
      date: newDates[doseType],
    }))
    setVaccinationWasUpdated(true)
  }

  const handleDateChange = (index, value) => {
    const newDates = [...dates]
    newDates[index] = value
    setDates(newDates)
    handleSetVaccination(newDates, index)
  }

  return (
    <div className='flex justify-center items-center gap-4 w-full'>
      <div className='w-2/5'>
        <p className='bg-fuchsia-300 rounded-lg p-1 text-fuchsia-700 font-bold'>
          {title}
        </p>
      </div>
      <div className='w-3/5 flex justify-center items-center'>
        {dates.map((date, index) => (
          <div
            key={index}
            className={`${inputContainerStyle} ${
              index === 0
                ? 'rounded-bl-lg rounded-tl-lg'
                : index === 4
                ? 'rounded-br-lg rounded-tr-lg'
                : ''
            }`}
          >
            <input
              className={inputStyle}
              type='date'
              value={date}
              onChange={(e) => handleDateChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default VaccinationScheduleRow
