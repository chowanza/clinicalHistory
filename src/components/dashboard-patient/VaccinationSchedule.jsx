import { useEffect, useState } from 'react'
import { getVaccination, updateVaccination } from '../../api/vaccination'
import { usePatients } from '../../context/PatientsContext'
import VaccinationScheduleRow from './VaccinationScheduleRow'

const VaccinationSchedule = () => {
  const rowsTitle = [
    'Tuberculosis',
    'Polio',
    'Pentavalente O Hexavalente',
    'Hepatitis B',
    'Sarampión, Rubeola, Parotiditis (Trivalente Viral)',
    'Hepatitis A',
    'Varicela (Lechina)',
    'Neumococo',
    'Meningococo',
    'Rotavirus',
    'Fiebre Amarilla',
    'Tetraxim',
    'Adacel (Tosferina)',
    'Toxoide',
    'VPH',
    'Antigripal',
    'COVID',
  ]

  const { patient } = usePatients()

  const fetchVaccinationData = async (id) => {
    try {
      const response = await getVaccination(id)
      return response.data
    } catch (error) {
      console.error('Error fetching vaccination data:', error)
      return null
    }
  }

  const updateVaccinationData = async (id, data) => {
    try {
      const response = await updateVaccination(id, data)
      return response.data
    } catch (error) {
      console.error('Error updating vaccination data:', error)
      return null
    }
  }

  const [vaccinationData, setVaccinationData] = useState(null)
  const [vaccinationUpdated, setVaccinationUpdated] = useState(null)
  const [vaccinationWasUpdated, setVaccinationWasUpdated] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchVaccinationData(patient._id)
      setVaccinationData(data)
    }
    fetchData()
  }, [])

  /*   useEffect(() => {
    console.log('Vaccination data updated:', vaccinationData)
  }, [vaccinationData]) */

  useEffect(() => {
    if (vaccinationWasUpdated && vaccinationUpdated) {
      const updateData = async () => {
        const updatedData = await updateVaccinationData(
          patient._id,
          vaccinationUpdated
        )
        if (updatedData) {
          setVaccinationWasUpdated(false)
          console.log('Vaccination data successfully updated:', updatedData)
        } else {
          console.error('Failed to update vaccination data')
        }
      }
      updateData()
    }
  }, [vaccinationWasUpdated])

  return (
    <div className='flex justify-center flex-col gap-6 pt-6'>
      <h1 className='font-bold text-2xl self-center'>Tarjeta de Vacunación</h1>
      <div className='flex flex-col'>
        <div className='flex justify-center items-center gap-4 w-full'>
          <div className='w-2/5'></div>
          <div className='w-3/5 flex justify-center items-center text-fuchsia-600 text-center font-semibold'>
            <span className='w-1/5'>1era Dosis</span>
            <span className='w-1/5'>2da Dosis</span>
            <span className='w-1/5'>3era Dosis</span>
            <span className='w-1/5'>Refuerzo</span>
            <span className='w-1/5'>Refuerzo</span>
          </div>
        </div>
        {/* rows */}
        {vaccinationData &&
          vaccinationData.length > 0 &&
          vaccinationData.map((vaccine, index) => {
            const vaccineName = vaccine.name
            return (
              <VaccinationScheduleRow
                key={index}
                title={vaccineName}
                rowIndex={index}
                setVaccination={setVaccinationUpdated}
                setVaccinationWasUpdated={setVaccinationWasUpdated}
                vaccinationData={vaccinationData[index]}
              />
            )
          })}
        {/* loading screen | Luego cambiar por un skeleton */}
        {(!vaccinationData || vaccinationData.length === 0) && (
          <div className='flex justify-center items-center w-full'>
            <p className='text-gray-500'>Cargando...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VaccinationSchedule
