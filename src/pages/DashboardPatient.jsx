import PatientCard from '../components/dashboard-patient/PatientCard'
import PatientInfoCard from '../components/dashboard-patient/PatientInfoCard'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link, useParams } from 'react-router-dom'
import { usePatients } from '../context/PatientsContext'
import { useEffect, useState } from 'react'
import { patientContactSections } from '../components/dashboard-patient/PatientContactConfig'

const DashboardPatient = () => {
  const { id } = useParams()
  const { patient, getPatient } = usePatients()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true)
        try {
          await getPatient(id)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen py-10'>
        <div className='text-xl font-medium'>
          Cargando información del paciente...
        </div>
      </main>
    )
  }

  return (
    <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen pt-2 pb-10'>
      <article className='w-full p-4 px-60 flex flex-col gap-6 relative'>
        <PatientCard patient={patient} />
        {patientContactSections.map((section, index) => {
          const processedSections = section.sections.map((item) => ({
            ...item,
            content: item.content.replace(
              /\{(.*?)\}/g,
              (match, field) => patient[field] || ''
            ),
          }))

          return (
            <PatientInfoCard
              key={index}
              title={section.title}
              titleIcon={section.titleIcon}
              sections={processedSections}
            />
          )
        })}
        <div className='w-full flex gap-4 items-center justify-end'>
          <Link
            to='/dashboard-doctor'
            className='h-10 p-3 font-semibold rounded-xl flex items-center gap-2 text-[#FA0F00] border-2 border-[#FA0F00] cursor-pointer
                    hover:scale-105 transition-transform duration-300 
                    hover:shadow-lg hover:shadow-[#FA0F00]/50 
                    hover:outline-2 hover:outline-white 
                    hover:bg-opacity-80 hover:animate-pulse'
          >
            <FaArrowRightFromBracket className='rotate-180' />
            Volver
          </Link>
          <button
            className='h-10 p-3 text-white font-semibold rounded-xl bg-[#FA0F00] flex items-center gap-2 border-slate-400 border cursor-pointer
                    hover:scale-105 transition-transform duration-300 
                    hover:shadow-lg hover:shadow-[#FA0F00]/50 
                    hover:outline-2 hover:outline-white 
                    hover:bg-opacity-80 hover:animate-pulse'
          >
            Download PDF
          </button>
        </div>
      </article>
    </main>
  )
}

export default DashboardPatient
