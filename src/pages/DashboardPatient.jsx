import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { usePatients } from '../context/PatientsContext'
import { useEffect, useState, useCallback } from 'react'
import { patientContactSections } from '../components/dashboard-patient/PatientContactConfig'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { calculateAge, calcularEdadPediatrica } from '../utils/ageUtils'
import PatientCard from '../components/dashboard-patient/PatientCard'
import PatientInfoCard from '../components/dashboard-patient/PatientInfoCard'
import ConsultationsSummary from '../components/dashboard-patient/ConsultationsSummary'
import AttachmentsGallery from '../components/dashboard-patient/AttachmentsGallery'
import Header from '../components/ui/Header'
import Modal from '../components/ui/Modal'
import FormPatient from '../components/dashboard-doctor/FormPatient'
import PatientPDF from '../components/dashboard-patient/PatientPDF'
import VaccinationSchedule from '../components/dashboard-patient/VaccinationSchedule'
import MedicalCalendar from '../components/MedicalCalendar/MedicalCalendar'

const DashboardPatient = () => {
  const { id, consultationId } = useParams()
  const navigate = useNavigate()
  const { patient, getPatient } = usePatients()
  const [isLoading, setIsLoading] = useState(true)
  const [consultationData, setConsultationData] = useState(null)
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
    medicalCalendar: false,
  })

  const closeModals = useCallback(() => {
    setModalState({
      form: false,
      vaccinationSchedule: false,
      medicalCalendar: false,
    })
  }, [])

  const openFormModal = useCallback(() => {
    setModalState({
      form: true,
      vaccinationSchedule: false,
      medicalCalendar: false,
    })
  }, [])

  const openVaccinationSchedule = useCallback(() => {
    setModalState({
      form: false,
      vaccinationSchedule: true,
      medicalCalendar: false,
    })
  }, [])

  const openMedicalCalendar = useCallback(() => {
    setModalState({
      form: false,
      vaccinationSchedule: false,
      medicalCalendar: true,
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true)
        try {
          await getPatient(id)
          
          // Si hay consultationId, obtener los datos de esa consulta específica
          if (consultationId) {
            const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations`, {
              credentials: 'include'
            })
            if (response.ok) {
              const consultations = await response.json()
              const consultation = consultations.find(c => c._id === consultationId)
              if (consultation) {
                setConsultationData(consultation)
              }
            }
          }
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [id, consultationId])

  useEffect(() => {
    if (patient) {
      // Si tenemos datos de consulta específica, usar esos datos
      const dataToUse = consultationData || patient
      
      setInputs((prev) => ({
        ...prev,
        age: calcularEdadPediatrica(patient.birthDate),
        head: dataToUse.pc,
        length: dataToUse.size,
        sex: 'male',
        weight: dataToUse.weight,
      }))
    }
  }, [patient, consultationData])

  // Función para obtener el título de la página
  const getPageTitle = () => {
    if (consultationId && consultationData) {
      return `Consulta - ${consultationData.consultMotive}`
    }
    return 'Historia Clínica del Paciente'
  }

  return (
    <>
      <Header
        patientPage
        openModal={{
          openFormModal,
          openVaccinationSchedule,
          openMedicalCalendar,
        }}
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
      <Modal
        isOpen={modalState.medicalCalendar}
        onClose={closeModals}
        size='large'
      >
        <button
          onClick={closeModals}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-6 right-0'
        >
          Cerrar
        </button>
        <MedicalCalendar />
      </Modal>
      <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen pt-2 pb-10'>
        <article className='w-full p-4 max-w-6xl mx-auto flex flex-col gap-6 relative'>
          {/* Título de la página */}
          {consultationId && consultationData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <h1 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Fecha: {new Date(consultationData.consultationDate).toLocaleDateString()}
              </p>
            </div>
          )}
          
          <PatientCard isLoading={isLoading} patient={patient} />
          
          {/* Solo mostrar ConsultationsSummary si no estamos viendo una consulta específica */}
          {!consultationId && (
            <ConsultationsSummary 
              patientId={id} 
              onConsultationUpdate={(consultations) => {
                // Actualizar el estado local si es necesario
                console.log('Consultations updated:', consultations)
              }}
            />
          )}
          
          {patientContactSections.map((section, index) => {
            const processedSections = section.sections.map((item) => ({
              ...item,
              content: item.content.replace(
                /\{(.*?)\}/g,
                (match, field) => {
                  // Si tenemos datos de consulta específica, usar esos datos
                  const dataToUse = consultationData || patient
                  return dataToUse[field] || ''
                }
              ),
            }))

            if (section.title == 'Información Personal') {
              processedSections[2].content = calculateAge(
                processedSections[3].content
              )?.formattedAge
            }

            // Eliminar la sección de percentiles
            if (section.title == 'Medidas') {
              return (
                <PatientInfoCard
                  key={index}
                  title={section.title}
                  titleIcon={section.titleIcon}
                  sections={processedSections}
                  isLoading={isLoading}
                />
              )
            }

            return (
              <PatientInfoCard
                key={index}
                title={section.title}
                titleIcon={section.titleIcon}
                sections={processedSections}
                isLoading={isLoading}
              />
            )
          })}
          
          {/* Sección de Anexos */}
          {consultationData && consultationData.attachments && consultationData.attachments.length > 0 && (
            <AttachmentsGallery 
              attachments={consultationData.attachments}
              title="Anexos de la Consulta"
            />
          )}
          
          {/* Anexos del paciente (si no estamos viendo una consulta específica) */}
          {!consultationId && patient && patient.attachments && patient.attachments.length > 0 && (
            <AttachmentsGallery 
              attachments={patient.attachments}
              title="Anexos del Paciente"
            />
          )}
          <div className='w-full flex flex-col sm:flex-row gap-4 items-center justify-end'>
            <Link
              to={consultationId ? `/dashboard-doctor/patients/${id}` : '/dashboard-doctor'}
              className='h-10 p-3 font-semibold rounded-xl flex items-center gap-2 text-[#FA0F00] border-2 border-[#FA0F00] cursor-pointer
                    hover:scale-105 transition-transform duration-300 
                    hover:shadow-lg hover:shadow-[#FA0F00]/50 
                    hover:outline-2 hover:outline-white 
                    hover:bg-opacity-80 hover:animate-pulse'
            >
              <FaArrowRightFromBracket className='rotate-180' />
              {consultationId ? 'Volver a Consultas' : 'Volver'}
            </Link>
            {isLoading ? (
              <button
                className='h-10 p-3 text-white font-semibold rounded-xl bg-[#FA0F00] flex items-center gap-2 border-slate-400 border cursor-pointer
                  hover:scale-105 transition-transform duration-300 
                  hover:shadow-lg hover:shadow-[#FA0F00]/50 
                  hover:outline-2 hover:outline-white 
                  hover:bg-opacity-80 hover:animate-pulse'
                onClick={openVaccinationSchedule}
              >
                Descargar PDF
              </button>
            ) : (
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
            )}
          </div>
        </article>
      </main>
    </>
  )
}

export default DashboardPatient
