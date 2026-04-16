import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaPlus,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaEdit,
  FaUser,
  FaSyringe,
  FaCalendar,
  FaFileAlt,
  FaArrowLeft,
  FaUserEdit,
  FaSort,
} from 'react-icons/fa'
import moment from 'moment'
import Header from '../components/ui/Header'
import FormPatient from '../components/dashboard-doctor/FormPatient'
import Modal from '../components/ui/Modal'
import VaccinationSchedule from '../components/dashboard-patient/VaccinationSchedule'
import MedicalCalendar from '../components/MedicalCalendar/MedicalCalendar'
import { usePatients } from '../context/PatientsContext'
import { getConsultationsRequest, createConsultationRequest, updateConsultationRequest, deleteConsultationRequest } from '../api/consultations'

// Función para calcular la edad en años, meses y días
const calculateAge = (birthDate) => {
  if (!birthDate) return null

  const birth = moment(birthDate)
  const now = moment()

  const years = now.diff(birth, 'years')
  const months = now.diff(birth, 'months') % 12
  const days = now.diff(birth, 'days') % 30

  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''} ${
      months > 0 ? `${months} mes${months > 1 ? 'es' : ''}` : ''
    }`
  } else if (months > 0) {
    return `${months} mes${months > 1 ? 'es' : ''} ${
      days > 0 ? `${days} día${days > 1 ? 's' : ''}` : ''
    }`
  } else {
    return `${days} día${days > 1 ? 's' : ''}`
  }
}

const PatientProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patient, getPatient } = usePatients()
  const [isLoading, setIsLoading] = useState(true)
  const [consultations, setConsultations] = useState([])

  const [modalState, setModalState] = useState({
    form: false,
    vaccinationSchedule: false,
    medicalCalendar: false,
    editPersonal: false,
    consultationForm: false,
  })

  const [editingConsultation, setEditingConsultation] = useState(null)

  // Estados para filtros y ordenamiento de consultas
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' o 'desc'
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredConsultations, setFilteredConsultations] = useState([])

  // Estado para prevenir duplicaciones
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        console.log('=== PATIENT PROFILE DEBUG ===')
        console.log('Patient ID:', id)
        setIsLoading(true)
        try {
          console.log('Fetching patient data...')
          await getPatient(id)
          console.log('Patient data fetched, now fetching consultations...')
          await fetchConsultations()
          console.log('Consultations fetched')
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
          console.log('Loading finished')
        }
      }
    }
    fetchData()
  }, [id])

  // Log para debuggear editingConsultation
  useEffect(() => {
    console.log('editingConsultation changed:', editingConsultation)
  }, [editingConsultation])

  // Log para debuggear patient y consultations
  useEffect(() => {
    console.log('Patient state:', patient)
    console.log('Consultations state:', consultations)
    console.log('Is loading:', isLoading)
  }, [patient, consultations, isLoading])

  // Filtrar y ordenar consultas cuando cambien los datos
  useEffect(() => {
    let filtered = [...consultations]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (consultation) =>
          consultation.consultMotive
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          consultation.diagnostic
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          consultation.consultationNumber?.toString().includes(searchTerm) ||
          moment(consultation.consultationDate)
            .format('DD/MM/YYYY')
            .includes(searchTerm)
      )
    }

    // Ordenar por fecha de creación (más recientes primero por defecto)
    filtered.sort((a, b) => {
      const dateA = new Date(a.consultationDate)
      const dateB = new Date(b.consultationDate)
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    setFilteredConsultations(filtered)
    console.log('Filtered consultations:', filtered.length)
  }, [consultations, searchTerm, sortOrder])

  // Abrir modal cuando editingConsultation se establezca
  useEffect(() => {
    if (editingConsultation && !modalState.consultationForm) {
      console.log(
        'Opening consultation form modal with data:',
        editingConsultation
      )
      // Verificar que editingConsultation tenga datos válidos y no esté vacío
      if (
        editingConsultation.consultationDate &&
        Object.keys(editingConsultation).length > 1
      ) {
        setModalState((prev) => ({ ...prev, consultationForm: true }))
      }
    }
  }, [editingConsultation])

  const fetchConsultations = async () => {
    try {
      const response = await getConsultationsRequest(id)
      // Ordenar por fecha de consulta (más reciente primero)
      const sortedConsultations = response.data.sort(
        (a, b) => new Date(b.consultationDate) - new Date(a.consultationDate)
      )
      setConsultations(sortedConsultations)
    } catch (error) {
      console.error('Error fetching consultations:', error)
    }
  }

  const closeModals = () => {
    setModalState({
      form: false,
      vaccinationSchedule: false,
      medicalCalendar: false,
      editPersonal: false,
      consultationForm: false,
    })
    setEditingConsultation(null)
  }

  const openFormModal = () => {
    setModalState({
      form: false,
      vaccinationSchedule: false,
      medicalCalendar: false,
      editPersonal: true,
      consultationForm: false,
    })
  }

  const openVaccinationSchedule = () => {
    setModalState({
      form: false,
      vaccinationSchedule: true,
      medicalCalendar: false,
    })
  }

  const openMedicalCalendar = () => {
    setModalState({
      form: false,
      vaccinationSchedule: false,
      medicalCalendar: true,
    })
  }

  const handleNewConsultation = () => {
    // Prevenir múltiples clics
    if (isSubmitting) {
      console.log('Already submitting, ignoring new consultation request')
      return
    }

    console.log('handleNewConsultation called, consultations:', consultations)

    // Si hay consultas, copiar los datos de la consulta más reciente
    if (consultations.length > 0) {
      const lastConsultation = consultations[0] // La primera del array es la más reciente
      console.log('Last consultation data:', lastConsultation)

      const consultationCopy = {
        ...lastConsultation,
        consultationDate: new Date().toISOString().slice(0, 16),
        consultationNumber: undefined, // Remover el número de consulta para que se genere automáticamente
        // Mantener los campos médicos de la consulta anterior para que se prellenen
        _id: undefined,
      }
      console.log('Consultation copy for pre-fill:', consultationCopy)

      // Solo establecer editingConsultation, el useEffect abrirá el modal
      setEditingConsultation(consultationCopy)
    } else {
      console.log('No consultations found, creating empty consultation')
      // Crear una consulta vacía para nueva consulta
      const emptyConsultation = {
        consultationDate: new Date().toISOString().slice(0, 16),
        consultMotive: '',
        physicalExam: '',
        weight: '',
        size: '',
        pc: '',
        abdominalCircumference: '',
        diagnostic: '',
        treatment: '',
        exams: '',
        medicalReference: '',
        medicalInformShared: '',
        medicalTrip: '',
        _id: undefined,
      }

      // Solo establecer editingConsultation, el useEffect abrirá el modal
      setEditingConsultation(emptyConsultation)
    }
  }

  const handleEditConsultation = (consultation) => {
    setEditingConsultation(consultation)
    setModalState((prev) => ({ ...prev, consultationForm: true }))
  }

  const handleDeleteConsultation = async (consultation) => {
    if (!consultation) {
      console.error('No consultation provided to handleDeleteConsultation')
      alert(
        'Error: No se proporcionó información de la consulta para eliminar.'
      )
      return
    }

    if (!consultation._id) {
      console.error('Consultation without _id for deletion:', consultation)
      console.error('Patient:', patient?.firstNames, patient?.lastNames)
      alert(
        `Error: No se pudo identificar la consulta para eliminar.\n\nPaciente: ${patient?.firstNames} ${patient?.lastNames}\n\nPor favor, contacte al administrador.`
      )
      return
    }

    if (
      window.confirm('¿Estás seguro de que quieres eliminar esta consulta?')
    ) {
      try {
        await deleteConsultationRequest(id, consultation._id)
        await fetchConsultations()
      } catch (error) {
        console.error('Error deleting consultation:', error)
        alert('Error al eliminar la consulta')
      }
    }
  }

  const handleConsultationSubmit = async (formData) => {
    // Prevenir duplicaciones
    if (isSubmitting) {
      console.log('Form already submitting, ignoring duplicate submit')
      return
    }

    // Agregar un delay adicional para evitar envíos rápidos
    await new Promise((resolve) => setTimeout(resolve, 200))

    setIsSubmitting(true)

    // Función para actualizar consultas después de cambios
    const updateConsultationsAfterChange = async () => {
      try {
        await fetchConsultations()
        console.log('Consultations updated after change')
      } catch (error) {
        console.error('Error updating consultations after change:', error)
      }
    }

    try {
      console.log('=== CONSULTATION SUBMIT DEBUG ===')
      console.log('Received formData:', formData)
      console.log('formData type:', typeof formData)
      console.log('formData instanceof FormData:', formData instanceof FormData)

      const isNewConsultation = !editingConsultation || !editingConsultation._id

      console.log('Submitting consultation:', {
        isNewConsultation,
        formData,
      })

      try {
        let result
        if (isNewConsultation) {
          result = await createConsultationRequest(id, formData)
        } else {
          result = await updateConsultationRequest(id, editingConsultation._id, formData)
        }
        
        console.log('Consultation saved successfully:', result.data)
        await updateConsultationsAfterChange()
        setModalState((prev) => ({ ...prev, consultationForm: false }))
        setEditingConsultation(null)
      } catch (error) {
        console.error('Error response:', error.response?.data)
        alert(
          `Error al guardar la consulta: ${
            error.response?.data?.message || 'Error desconocido'
          }`
        )
      }
      console.log('=== END CONSULTATION SUBMIT DEBUG ===')
    } catch (error) {
      console.error('Error saving consultation:', error)
      alert('Error al guardar la consulta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewConsultation = (consultation) => {
    if (!consultation) {
      console.error('No consultation provided to handleViewConsultation')
      alert('Error: No se proporcionó información de la consulta.')
      return
    }

    if (!consultation._id) {
      console.error('Consultation without _id:', consultation)
      console.error('Patient:', patient?.firstNames, patient?.lastNames)
      console.error('All consultations:', consultations)
      alert(
        `Error: La consulta no tiene un identificador válido.\n\nPaciente: ${patient?.firstNames} ${patient?.lastNames}\n\nPor favor, contacte al administrador.`
      )
      return
    }

    navigate(
      `/dashboard-doctor/patients/${id}/consultation/${consultation._id}`
    )
  }

  const handleLogout = () => {
    // Implementar logout
    navigate('/auth')
  }

  // Función para actualizar automáticamente el contador de anexos
  const updateAttachmentCount = (consultationId, newCount) => {
    setFilteredConsultations((prev) =>
      prev.map((consultation) =>
        consultation._id === consultationId
          ? {
              ...consultation,
              attachments: consultation.attachments.slice(0, newCount),
            }
          : consultation
      )
    )
  }

  // Función para actualizar anexos de una consulta específica
  const updateConsultationAttachments = (consultationId, newAttachments) => {
    setConsultations((prev) =>
      prev.map((consultation) =>
        consultation._id === consultationId
          ? { ...consultation, attachments: newAttachments }
          : consultation
      )
    )
    setFilteredConsultations((prev) =>
      prev.map((consultation) =>
        consultation._id === consultationId
          ? { ...consultation, attachments: newAttachments }
          : consultation
      )
    )
  }

  // Función para actualizar consultas después de cambios
  const updateConsultationsAfterChange = async () => {
    try {
      await fetchConsultations()
      console.log('Consultations updated after change')
    } catch (error) {
      console.error('Error updating consultations after change:', error)
    }
  }

  // Función para manejar cambios en anexos desde el detalle de consulta
  const handleAttachmentChange = (consultationId, newAttachments) => {
    updateConsultationAttachments(consultationId, newAttachments)
  }

  // Escuchar eventos de cambios en anexos
  useEffect(() => {
    const handleConsultationAttachmentsChanged = (event) => {
      const { consultationId, patientId, attachments } = event.detail

      // Solo actualizar si es el paciente actual
      if (patientId === id) {
        console.log(
          'Updating consultation attachments from event:',
          consultationId,
          attachments
        )
        updateConsultationAttachments(consultationId, attachments)
      }
    }

    window.addEventListener(
      'consultationAttachmentsChanged',
      handleConsultationAttachmentsChanged
    )

    return () => {
      window.removeEventListener(
        'consultationAttachmentsChanged',
        handleConsultationAttachmentsChanged
      )
    }
  }, [id])

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
            Paciente no encontrado
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            El paciente que buscas no existe o no tienes permisos para verlo.
          </p>
          <button
            onClick={() => navigate('/dashboard-doctor')}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />

      {/* Modales */}
      <Modal isOpen={modalState.editPersonal} onClose={closeModals}>
        <button
          onClick={closeModals}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-8 right-5'
        >
          Cerrar
        </button>
        <div className='p-6 max-w-4xl mx-auto'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center'>
            Editar Información Personal y Familiar
          </h2>
          <FormPatient
            patientData={{ ...patient, _id: id }}
            closeModal={closeModals}
            isEditMode
            editMode={null}
          />
        </div>
      </Modal>

      <Modal isOpen={modalState.consultationForm} onClose={closeModals}>
        <button
          onClick={closeModals}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-8 right-5'
        >
          Cerrar
        </button>

        <FormPatient
          patientData={{ _id: id }}
          consultationData={editingConsultation}
          closeModal={closeModals}
          onSubmit={handleConsultationSubmit}
          isConsultationMode
          isNewConsultation={!editingConsultation || !editingConsultation._id}
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

      <main className='w-full min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark pt-2 pb-30'>
        <div className='w-full max-w-6xl mx-auto p-6'>
          {/* Header con navegación */}
          <div className='rounded-2xl sticky top-0 z-10 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 shadow-2xl p-4 sm:p-6 mb-8'>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
              {/* Sección izquierda: Info del paciente */}
              <div className='flex items-center gap-4 sm:gap-6 flex-1 min-w-0'>
                {/* Botón de navegación mejorado */}
                <button
                  onClick={() => navigate('/dashboard-doctor')}
                  className='group flex items-center gap-2 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 border border-gray-300 dark:border-slate-600 hover:border-transparent rounded-xl transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-lg transform hover:scale-105'
                >
                  <FaArrowLeft className='transition-transform duration-300 group-hover:-translate-x-1' />
                  <span className='hidden sm:inline'>Dashboard</span>
                </button>

                {/* Avatar y información del paciente mejorados */}
                <div className='flex items-center gap-4 flex-1 min-w-0'>
                  {/* Avatar con efecto de brillo */}
                  <div className='relative'>
                    <div className='w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-2xl ring-4 ring-white/20 dark:ring-slate-700/50 transform hover:scale-110 transition-all duration-300'>
                      {patient?.firstNames?.charAt(0)?.toUpperCase()}
                      {patient?.lastNames?.charAt(0)?.toUpperCase()}
                    </div>
                    {/* Indicador de estado online */}
                    <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg'></div>
                  </div>

                  {/* Información del paciente */}
                  <div className='flex-1 min-w-0'>
                    <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight'>
                      {patient?.firstNames} {patient?.lastNames}
                    </h1>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1'>
                      <span className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
                        {patient?.birthDate
                          ? calculateAge(patient.birthDate)
                          : 'Edad no disponible'}
                      </span>
                      <span className='hidden sm:block w-1 h-1 bg-gray-400 rounded-full'></span>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        ID: #{id?.slice(-6)?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección derecha: Botones de acción mejorados */}
              <div className='flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end'>
                <button
                  onClick={openFormModal}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400/30'
                  title='Editar Información Personal y Familiar'
                >
                  <FaUserEdit className='transition-transform duration-300 group-hover:rotate-12' />
                  <span className='hidden sm:inline'>Editar Perfil</span>
                </button>

                <button
                  onClick={openMedicalCalendar}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-indigo-500/20 hover:border-indigo-400/30'
                  title='Gestión de Recetas Médicas'
                >
                  <FaCalendarAlt className='transition-transform duration-300 group-hover:scale-110' />
                  <span className='hidden sm:inline'>Recetas</span>
                </button>

                <button
                  onClick={openVaccinationSchedule}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-rose-500/20 hover:border-rose-400/30'
                  title='Calendario de Vacunación'
                >
                  <FaSyringe className='transition-transform duration-300 group-hover:rotate-12' />
                  <span className='hidden sm:inline'>Vacunas</span>
                </button>
              </div>
            </div>

            {/* Barra de progreso decorativa */}
            <div className='mt-4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20'></div>
          </div>

          {/* Información Personal */}
          <div className='bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-600 p-6 sm:p-8 mb-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <div className='flex items-center mb-6'>
              <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg mr-4'>
                <FaUser className='text-white text-xl' />
              </div>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent'>
                  Información Personal
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Datos personales del paciente
                </p>
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className='group'>
                <label className='block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  Nombres
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium'>
                    {patient?.firstNames || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  Apellidos
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium'>
                    {patient?.lastNames || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  Fecha de Nacimiento
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium'>
                    {patient?.birthDate
                      ? moment(patient.birthDate).format('DD/MM/YYYY')
                      : 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  Grupo Sanguíneo y RH
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium'>
                    {patient?.bloodType || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  Edad
                </label>
                <div className='bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-sm'>
                  <p className='text-blue-800 dark:text-blue-200 font-bold text-lg'>
                    {patient?.birthDate
                      ? calculateAge(patient.birthDate)
                      : 'No calculable'}
                  </p>
                </div>
              </div>
              <div className='sm:col-span-2 group'>
                <label className='block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  Dirección
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium'>
                    {patient?.address || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Familiar */}
          <div className='bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-xl border border-emerald-100 dark:border-slate-600 p-6 sm:p-8 mb-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <div className='flex items-center mb-6'>
              <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg mr-4'>
                <FaUser className='text-white text-xl' />
              </div>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent'>
                  Información Familiar
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Datos de contacto familiar y especialistas
                </p>
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className='group'>
                <label className='block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                  Nombre del Padre
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium'>
                    {patient?.dadName || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                  Nombre de la Madre
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium'>
                    {patient?.momName || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='sm:col-span-2 group'>
                <label className='block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                  Obstetra/Ginecólogo
                </label>
                <div className='bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-sm'>
                  <p className='text-emerald-800 dark:text-emerald-200 font-medium'>
                    {patient?.obstetrician || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                  Teléfono
                </label>
                <div className='bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-sm border-2 border-blue-200 dark:border-blue-700'>
                  <p className='text-blue-800 dark:text-blue-200 font-medium'>
                    {patient?.phone || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                  Correo Electrónico
                </label>
                <div className='bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-sm border-2 border-blue-200 dark:border-blue-700'>
                  <p className='text-blue-800 dark:text-blue-200 font-medium break-all'>
                    {patient?.email || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Historia Médica */}
          <div className='bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-xl border border-purple-100 dark:border-slate-600 p-6 sm:p-8 mb-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <div className='flex items-center mb-6'>
              <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg mr-4'>
                <FaFileAlt className='text-white text-xl' />
              </div>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent'>
                  Historia Médica
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Antecedentes médicos del paciente
                </p>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              <div className='group'>
                <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  Historia Neonatal
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm min-h-[100px]'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium whitespace-pre-wrap leading-relaxed'>
                    {patient?.neonatal || (
                      <span className='text-gray-500 dark:text-gray-400 italic'>
                        No hay información registrada sobre la historia neonatal
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  Historia Personal
                </label>
                <div className='bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm min-h-[100px]'>
                  <p className='text-gray-900 dark:text-gray-100 font-medium whitespace-pre-wrap leading-relaxed'>
                    {patient?.personal || (
                      <span className='text-gray-500 dark:text-gray-400 italic'>
                        No hay información registrada sobre la historia personal
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className='group'>
                <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  Historia Familiar
                </label>
                <div className='bg-gradient-to-r from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 shadow-sm min-h-[100px]'>
                  <p className='text-purple-800 dark:text-purple-200 font-medium whitespace-pre-wrap leading-relaxed'>
                    {patient?.familiar || (
                      <span className='text-purple-500 dark:text-purple-400 italic'>
                        No hay información registrada sobre la historia familiar
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gestión de Consultas */}
          <div className='bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 sm:p-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4'>
              <h2 className='text-lg sm:text-xl font-bold text-gray-800 dark:text-white'>
                Gestión de Consultas
              </h2>
              <button
                onClick={handleNewConsultation}
                disabled={isSubmitting}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <FaPlus />
                {isSubmitting ? 'Guardando...' : 'Nueva Consulta'}
              </button>
            </div>

            {/* Filtros y controles */}
            {consultations.length > 0 && (
              <div className='mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg'>
                <div className='flex flex-col sm:flex-row gap-3'>
                  {/* Búsqueda */}
                  <div className='flex-1'>
                    <input
                      type='text'
                      placeholder='Buscar por motivo, diagnóstico, número o fecha...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white text-sm'
                    />
                  </div>

                  {/* Ordenamiento */}
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Ordenar:
                    </span>
                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                      }
                      className='flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm'
                    >
                      {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguas'}
                      <FaSort className='text-xs' />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {consultations.length === 0 ? (
              <div className='text-center py-6 sm:py-8'>
                <FaCalendarAlt className='mx-auto text-3xl sm:text-4xl text-gray-400 mb-3 sm:mb-4' />
                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
                  No hay consultas registradas para este paciente
                </p>
                <button
                  onClick={handleNewConsultation}
                  className='px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base'
                >
                  Crear Primera Consulta
                </button>
              </div>
            ) : (
              <div className='max-h-96 overflow-y-auto pr-2'>
                <div className='grid gap-3 sm:gap-4'>
                  {filteredConsultations.map((consultation, index) => (
                    <div
                      key={consultation._id}
                      className='border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow'
                    >
                      <div className='flex flex-col sm:flex-row justify-between items-start gap-3'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
                            <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                              Consulta {consultation.consultationNumber}
                            </span>
                            <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                              {moment(consultation.consultationDate).format(
                                'DD/MM/YYYY HH:mm'
                              )}
                            </span>
                          </div>
                          <h3 className='font-semibold text-gray-800 dark:text-white mb-1 text-sm sm:text-base'>
                            Motivo: {consultation.consultMotive}
                          </h3>
                          <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2'>
                            Diagnóstico: {consultation.diagnostic}
                          </p>
                          <div className='flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400'>
                            <span>Peso: {consultation.weight}</span>
                            <span>Talla: {consultation.size}</span>
                            <span>PC: {consultation.pc}</span>
                            <span>
                              Circ. Abdominal:{' '}
                              {consultation.abdominalCircumference}
                            </span>
                          </div>

                          {/* Archivos adjuntos */}
                          <div className='mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400'>
                            <FaEye />
                            {consultation.attachments
                              ? consultation.attachments.length
                              : 0}{' '}
                            anexo
                            {(consultation.attachments
                              ? consultation.attachments.length
                              : 0) !== 1
                              ? 's'
                              : ''}
                          </div>
                        </div>
                        <div className='flex gap-1 sm:gap-2 flex-shrink-0'>
                          <button
                            onClick={() => handleViewConsultation(consultation)}
                            className='p-1.5 sm:p-2 text-green-600 hover:text-green-700 transition-colors'
                            title='Ver consulta'
                          >
                            <FaEye className='text-sm sm:text-base' />
                          </button>
                          <button
                            onClick={() => handleEditConsultation(consultation)}
                            className='p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 transition-colors'
                            title='Editar consulta'
                          >
                            <FaEdit className='text-sm sm:text-base' />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteConsultation(consultation)
                            }
                            className='p-1.5 sm:p-2 text-red-600 hover:text-red-700 transition-colors'
                            title='Eliminar consulta'
                          >
                            <FaTrash className='text-sm sm:text-base' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default PatientProfile
