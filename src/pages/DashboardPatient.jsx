import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link, useParams } from 'react-router-dom'
import { usePatients } from '../context/PatientsContext'
import { useEffect, useState, useCallback } from 'react'
import { patientContactSections } from '../components/dashboard-patient/PatientContactConfig'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { calculateAge, calcularEdadPediatrica } from '../utils/ageUtils'
import PatientCard from '../components/dashboard-patient/PatientCard'
import PatientInfoCard from '../components/dashboard-patient/PatientInfoCard'
import Header from '../components/ui/Header'
import Modal from '../components/ui/Modal'
import FormPatient from '../components/dashboard-doctor/FormPatient'
import PatientPDF from '../components/dashboard-patient/PatientPDF'
import VaccinationSchedule from '../components/dashboard-patient/VaccinationSchedule'
import { Percentiles } from '../components/dashboard-patient/Percentiles'

const DashboardPatient = () => {
  const { id } = useParams()
  const { patient, getPatient } = usePatients()
  const [isLoading, setIsLoading] = useState(true)
  const [inputs, setInputs] = useState({
    age: {},
    head: '',
    length: '',
    sex: '',
    weight: '',
  })

  const [modalState, setModalState] = useState({
    form: false,
    vaccinationSchedule: false,
  })

  const closeModals = useCallback(() => {
    setModalState({ form: false, vaccinationSchedule: false })
  }, [])

  const openFormModal = useCallback(() => {
    setModalState({ form: true, vaccinationSchedule: false })
  }, [])

  const openVaccinationSchedule = useCallback(() => {
    setModalState({ form: false, vaccinationSchedule: true })
  }, [])

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

  useEffect(() => {
    if (patient) {
      setInputs((prev) => ({
        ...prev,
        age: calcularEdadPediatrica(patient.birthDate),
        head: patient.pc,
        length: patient.size,
        sex: 'male',
        weight: patient.weight,
      }))
    }
    console.log(patient)
  }, [patient])

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
    <>
      <Header
        patientPage
        openModal={{ openFormModal, openVaccinationSchedule }}
      />
      <Modal isOpen={modalState.form} onClose={closeModals}>
        <button
          onClick={closeModals}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-8 right-5'
        >
          Cerrar
        </button>
        <FormPatient
          patientData={patient}
          closeModal={closeModals}
          isEditMode
        />
      </Modal>
      <Modal isOpen={modalState.vaccinationSchedule} onClose={closeModals}>
        <button
          onClick={closeModals}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-8 right-5'
        >
          Cerrar
        </button>
        <VaccinationSchedule />
      </Modal>
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

            if (section.title == 'Información Personal') {
              processedSections[2].content = calculateAge(
                processedSections[3].content
              )?.formattedAge
            }

            if (section.title == 'Medidas') {
              return (
                <span
                  key={index}
                  className='flex flex-col gap-6 justify-center items-center'
                >
                  <PatientInfoCard
                    key={index}
                    title={section.title}
                    titleIcon={section.titleIcon}
                    sections={processedSections}
                  />
                  <Percentiles inputs={inputs} />
                </span>
              )
            }

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
            <PDFDownloadLink
              document={<PatientPDF patient={patient} />}
              fileName={`${patient.firstNames}-${patient.lastNames}.pdf`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {({ loading }) => (
                <button
                  className='h-10 p-3 text-white font-semibold rounded-xl bg-[#FA0F00] flex items-center gap-2 border-slate-400 border cursor-pointer
                  hover:scale-105 transition-transform duration-300 
                  hover:shadow-lg hover:shadow-[#FA0F00]/50 
                  hover:outline-2 hover:outline-white 
                  hover:bg-opacity-80 hover:animate-pulse'
                >
                  {loading ? 'Generando...' : 'Descargar PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </article>
      </main>
    </>
  )
}

export default DashboardPatient
