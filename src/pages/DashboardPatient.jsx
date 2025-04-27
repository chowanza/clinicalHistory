import PatientCard from '../components/dashboard-patient/PatientCard'
import PatientInfoCard from '../components/dashboard-patient/PatientInfoCard'
import ThemeSwitch from '../components/ui/ThemeSwitch'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link, useParams } from 'react-router-dom'
import { usePatients } from '../context/PatientsContext'
import { useEffect } from 'react'
import { patientContactSections } from '../components/dashboard-patient/PatientContactConfig'

const DashboardPatient = () => {
  const { id } = useParams()
  const { patient, getPatient } = usePatients()

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getPatient(id)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (patient) {
      console.log('Patient data:', patient)
    }
  }, [patient])

  return (
    <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen py-10'>
      <header className='flex justify-end p-0 w-full absolute top-6 right-30 bg-background-transparent dark:bg-background-transparent'>
        <Link className='flex justify-center items-center gap-3 font-semibold text-secondary'>
          Log Out <FaArrowRightFromBracket />
        </Link>
      </header>
      <div className='absolute top-0 right-0 p-4'>
        <ThemeSwitch />
      </div>
      <article className='w-full p-4 px-60 flex flex-col gap-6'>
        <PatientCard />
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
        <button
          className='self-end h-10 p-3 text-white font-semibold rounded-xl bg-[#FA0F00] flex items-center gap-2 border-slate-400 border cursor-pointer
                   hover:scale-105 transition-transform duration-300 
                   hover:shadow-lg hover:shadow-[#FA0F00]/50 
                   hover:outline-2 hover:outline-white 
                   hover:bg-opacity-80 hover:animate-pulse'
        >
          Download PDF
        </button>
      </article>
    </main>
  )
}

export default DashboardPatient
