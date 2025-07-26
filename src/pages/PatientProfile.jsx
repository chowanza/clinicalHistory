import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaPlus, FaTrash, FaEye, FaCalendarAlt, FaEdit, FaUser, FaSyringe, FaCalendar, FaFileAlt, FaArrowLeft, FaUserEdit } from 'react-icons/fa'
import moment from 'moment'
import Header from '../components/ui/Header'
import FormPatient from '../components/dashboard-doctor/FormPatient'
import Modal from '../components/ui/Modal'
import VaccinationSchedule from '../components/dashboard-patient/VaccinationSchedule'
import MedicalCalendar from '../components/MedicalCalendar/MedicalCalendar'
import { usePatients } from '../context/PatientsContext'

// Función para calcular la edad en años, meses y días
const calculateAge = (birthDate) => {
  if (!birthDate) return null
  
  const birth = moment(birthDate)
  const now = moment()
  
  const years = now.diff(birth, 'years')
  const months = now.diff(birth, 'months') % 12
  const days = now.diff(birth, 'days') % 30
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''} ${months > 0 ? `${months} mes${months > 1 ? 'es' : ''}` : ''}`
  } else if (months > 0) {
    return `${months} mes${months > 1 ? 'es' : ''} ${days > 0 ? `${days} día${days > 1 ? 's' : ''}` : ''}`
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

  // Abrir modal cuando editingConsultation se establezca
  useEffect(() => {
    if (editingConsultation && !modalState.consultationForm) {
      console.log('Opening consultation form modal with data:', editingConsultation)
      // Verificar que editingConsultation tenga datos válidos y no esté vacío
      if (editingConsultation.consultationDate && Object.keys(editingConsultation).length > 1) {
        setModalState(prev => ({ ...prev, consultationForm: true }))
      }
    }
  }, [editingConsultation])

  const fetchConsultations = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        // Ordenar por fecha de consulta (más reciente primero)
        const sortedConsultations = data.sort((a, b) => 
          new Date(b.consultationDate) - new Date(a.consultationDate)
        )
        setConsultations(sortedConsultations)
      }
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
    console.log('handleNewConsultation called, consultations:', consultations);
    
    // Si hay consultas, copiar los datos de la consulta más reciente
    if (consultations.length > 0) {
      const lastConsultation = consultations[0]; // La primera del array es la más reciente
      console.log('Last consultation data:', lastConsultation);
      
      const consultationCopy = {
        ...lastConsultation,
        consultationDate: new Date().toISOString().slice(0, 16),
        consultationNumber: undefined, // Remover el número de consulta para que se genere automáticamente
        // Mantener los campos médicos de la consulta anterior para que se prellenen
        _id: undefined
      };
      console.log('Consultation copy for pre-fill:', consultationCopy);
      
      // Solo establecer editingConsultation, el useEffect abrirá el modal
      setEditingConsultation(consultationCopy);
    } else {
      console.log('No consultations found, creating empty consultation');
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
        _id: undefined
      };
      
      // Solo establecer editingConsultation, el useEffect abrirá el modal
      setEditingConsultation(emptyConsultation);
    }
  }

  const handleEditConsultation = (consultation) => {
    setEditingConsultation(consultation)
    setModalState(prev => ({ ...prev, consultationForm: true }))
  }

  const handleDeleteConsultation = async (consultation) => {
    if (!consultation) {
      console.error('No consultation provided to handleDeleteConsultation');
      alert('Error: No se proporcionó información de la consulta para eliminar.');
      return;
    }

    if (!consultation._id) {
      console.error('Consultation without _id for deletion:', consultation);
      console.error('Patient:', patient?.firstNames, patient?.lastNames);
      alert(`Error: No se pudo identificar la consulta para eliminar.\n\nPaciente: ${patient?.firstNames} ${patient?.lastNames}\n\nPor favor, contacte al administrador.`);
      return
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations/${consultation._id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (response.ok) {
          await fetchConsultations()
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Error al eliminar la consulta: ${errorData.message || 'Error desconocido'}`)
        }
      } catch (error) {
        console.error('Error deleting consultation:', error)
        alert('Error al eliminar la consulta')
      }
    }
  }

  const handleConsultationSubmit = async (formData) => {
    try {
      console.log('=== CONSULTATION SUBMIT DEBUG ===')
      console.log('Received formData:', formData)
      console.log('formData type:', typeof formData)
      console.log('formData instanceof FormData:', formData instanceof FormData)
      
      const isNewConsultation = !editingConsultation || !editingConsultation._id;
      
      const url = isNewConsultation 
        ? `http://localhost:4000/api/tasks/${id}/consultations`
        : `http://localhost:4000/api/tasks/${id}/consultations/${editingConsultation._id}`
      
      const method = isNewConsultation ? 'POST' : 'PUT'
      
      console.log('Submitting consultation:', { isNewConsultation, url, method, formData })
      
      // Si formData es FormData (con archivos), enviar directamente
      // Si es un objeto normal, convertirlo a JSON
      const body = formData instanceof FormData ? formData : JSON.stringify(formData)
      const headers = formData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      
      console.log('Request body:', body)
      console.log('Request headers:', headers)
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers,
        body
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Consultation saved successfully:', result)
        await fetchConsultations()
        setModalState(prev => ({ ...prev, consultationForm: false }))
        setEditingConsultation(null)
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        alert(`Error al guardar la consulta: ${errorData.message || 'Error desconocido'}`)
      }
      console.log('=== END CONSULTATION SUBMIT DEBUG ===')
    } catch (error) {
      console.error('Error saving consultation:', error)
      alert('Error al guardar la consulta')
    }
  }

  const handleViewConsultation = (consultation) => {
    if (!consultation) {
      console.error('No consultation provided to handleViewConsultation');
      alert('Error: No se proporcionó información de la consulta.');
      return;
    }

    if (!consultation._id) {
      console.error('Consultation without _id:', consultation);
      console.error('Patient:', patient?.firstNames, patient?.lastNames);
      console.error('All consultations:', consultations);
      alert(`Error: La consulta no tiene un identificador válido.\n\nPaciente: ${patient?.firstNames} ${patient?.lastNames}\n\nPor favor, contacte al administrador.`);
      return
    }
    
    navigate(`/dashboard-doctor/patients/${id}/consultation/${consultation._id}`)
  }

  const handleLogout = () => {
    // Implementar logout
    navigate('/auth')
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Paciente no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            El paciente que buscas no existe o no tienes permisos para verlo.
          </p>
          <button
            onClick={() => navigate('/dashboard-doctor')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Editar Información Personal y Familiar
          </h2>
          <FormPatient
            patientData={patient}
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
          patientData={null}
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

      <Modal isOpen={modalState.medicalCalendar} onClose={closeModals} size='large'>
        <button
          onClick={closeModals}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-6 right-0'
        >
          Cerrar
        </button>
        <MedicalCalendar />
      </Modal>



      <main className='w-full min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark pt-2 pb-10'>
        <div className="w-full max-w-6xl mx-auto p-6">
          {/* Header con navegación */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/dashboard-doctor')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors text-sm"
                >
                  <FaArrowLeft />
                  <span className="hidden sm:inline">Volver al Dashboard</span>
                </button>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Avatar con iniciales */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                    {patient?.firstNames?.charAt(0)?.toUpperCase()}{patient?.lastNames?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                      {patient?.firstNames} {patient?.lastNames}
                    </h1>
                  </div>
                </div>
              </div>
              
              {/* Navegación superior */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={openFormModal}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl"
                  title="Editar Información Personal y Familiar"
                >
                  <FaUserEdit />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={openMedicalCalendar}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl"
                  title="Recipe"
                >
                  <FaCalendarAlt />
                  <span className="hidden sm:inline">Recipe</span>
                </button>
                <button
                  onClick={openVaccinationSchedule}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl"
                  title="Tarjeta de Vacunación"
                >
                  <FaSyringe />
                  <span className="hidden sm:inline">Vacunación</span>
                </button>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Información Personal
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombres
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.firstNames}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Apellidos
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.lastNames}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha de Nacimiento
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.birthDate ? moment(patient.birthDate).format('DD/MM/YYYY') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Edad
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.birthDate ? calculateAge(patient.birthDate) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.phone || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo Electrónico
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.email || 'N/A'}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.address || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Información Familiar */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Información Familiar
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre del Padre
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.dadName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre de la Madre
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.momName}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Obstetra/Ginecólogo
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {patient?.obstetrician}
                </p>
              </div>
            </div>
          </div>

          {/* Historia Médica */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Historia Médica
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Historia Neonatal
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base whitespace-pre-wrap">
                  {patient?.neonatal || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Historia Personal
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base whitespace-pre-wrap">
                  {patient?.personal || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Historia Familiar
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm sm:text-base whitespace-pre-wrap">
                  {patient?.familiar || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Gestión de Consultas */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Gestión de Consultas
              </h2>
              <button
                onClick={handleNewConsultation}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <FaPlus />
                Nueva Consulta
              </button>
            </div>
            
            {consultations.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <FaCalendarAlt className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  No hay consultas registradas para este paciente
                </p>
                <button
                  onClick={handleNewConsultation}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Crear Primera Consulta
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {consultations.map((consultation, index) => (
                  <div
                    key={consultation._id}
                    className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Consulta {consultation.consultationNumber}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {moment(consultation.consultationDate).format('DD/MM/YYYY HH:mm')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm sm:text-base">
                          Motivo: {consultation.consultMotive}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Diagnóstico: {consultation.diagnostic}
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Peso: {consultation.weight}</span>
                          <span>Talla: {consultation.size}</span>
                          <span>PC: {consultation.pc}</span>
                          <span>Circ. Abdominal: {consultation.abdominalCircumference}</span>
                        </div>
                        
                        {/* Archivos adjuntos */}
                        {/* (Eliminado: visualización de archivos adjuntos) */}
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewConsultation(consultation)}
                          className="p-1.5 sm:p-2 text-green-600 hover:text-green-700 transition-colors"
                          title="Ver consulta"
                        >
                          <FaEye className="text-sm sm:text-base" />
                        </button>
                        <button
                          onClick={() => handleEditConsultation(consultation)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Editar consulta"
                        >
                          <FaEdit className="text-sm sm:text-base" />
                        </button>
                        <button
                          onClick={() => handleDeleteConsultation(consultation)}
                          className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 transition-colors"
                          title="Eliminar consulta"
                        >
                          <FaTrash className="text-sm sm:text-base" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default PatientProfile 