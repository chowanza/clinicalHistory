import React, { useState, useEffect } from 'react'
import { FaPlus, FaEye, FaCalendarAlt, FaTrash, FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Modal from '../ui/Modal'
import FormPatient from '../dashboard-doctor/FormPatient'

const ConsultationsSummary = ({ patientId, onConsultationUpdate }) => {
  const [consultations, setConsultations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchConsultations()
  }, [patientId])

  const fetchConsultations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:4000/api/tasks/${patientId}/consultations`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setConsultations(data)
        // Notificar al componente padre sobre la actualización
        if (onConsultationUpdate) {
          onConsultationUpdate(data)
        }
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConsultation = () => {
    // Si hay consultas, copiar los datos de la consulta más reciente
    if (consultations.length > 0) {
      const lastConsultation = consultations[0]; // La primera del array es la más reciente
      const consultationCopy = {
        ...lastConsultation,
        consultationDate: new Date().toISOString().slice(0, 16),
        _id: undefined
      };
      setEditingConsultation(consultationCopy);
    } else {
      setEditingConsultation(null);
    }
    setShowFormModal(true);
  }

  const handleEditConsultation = (consultation) => {
    if (!consultation._id) {
      console.error('Consultation without _id for editing:', consultation);
      alert('Error: La consulta no tiene un identificador válido para editar. Por favor, contacte al administrador.');
      return;
    }
    setEditingConsultation(consultation)
    setShowFormModal(true)
  }

  const handleViewConsultation = (consultation) => {
    if (!consultation._id) {
      console.error('Consultation without _id:', consultation);
      alert('Error: La consulta no tiene un identificador válido. Por favor, contacte al administrador.');
      return;
    }
    navigate(`/dashboard-doctor/patients/${patientId}/consultation/${consultation._id}`)
  }

  const handleDeleteConsultation = async (consultationId) => {
    if (!consultationId) {
      console.error('No consultationId provided for deletion');
      alert('Error: No se pudo identificar la consulta para eliminar.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/tasks/${patientId}/consultations/${consultationId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (response.ok) {
          await fetchConsultations()
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Error al eliminar la consulta: ${errorData.message || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('Error deleting consultation:', error)
        alert('Error al eliminar la consulta')
      }
    }
  }

  const handleFormSubmit = async (formData) => {
    try {
      const isNewConsultation = !editingConsultation || !editingConsultation._id;
      
      const url = isNewConsultation 
        ? `http://localhost:4000/api/tasks/${patientId}/consultations`
        : `http://localhost:4000/api/tasks/${patientId}/consultations/${editingConsultation._id}`
      
      const method = isNewConsultation ? 'POST' : 'PUT'
      
      // Si formData es FormData (con archivos), enviar directamente
      // Si es un objeto normal, convertirlo a JSON
      const body = formData instanceof FormData ? formData : JSON.stringify(formData)
      const headers = formData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      
      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body
      })

      if (response.ok) {
        await fetchConsultations()
        setShowFormModal(false)
        setEditingConsultation(null)
      }
    } catch (error) {
      console.error('Error saving consultation:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)}>
        <button
          onClick={() => setShowFormModal(false)}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-8 right-5'
        >
          Cerrar
        </button>
        <FormPatient
          patientData={null}
          consultationData={editingConsultation}
          closeModal={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
          isConsultationMode
          isNewConsultation={!editingConsultation || !editingConsultation._id}
        />
      </Modal>

      <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaCalendarAlt className="text-xl sm:text-2xl text-purple-600" />
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              Consultas del Paciente
            </h2>
          </div>
          <button
            onClick={handleNewConsultation}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors shadow text-sm sm:text-base w-full sm:w-auto justify-center"
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
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors shadow text-sm sm:text-base"
            >
              Crear Primera Consulta
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Mostrar las últimas 3 consultas */}
            {consultations.slice(0, 3).map((consultation, index) => (
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
                      <span>Peso: {consultation.weight} kg</span>
                      <span>Talla: {consultation.size} cm</span>
                      <span>PC: {consultation.pc} cm</span>
                      <span>Circ. Abdominal: {consultation.abdominalCircumference} cm</span>
                    </div>
                    
                    {/* Archivos adjuntos */}
                    
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
                      onClick={() => handleDeleteConsultation(consultation._id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Eliminar consulta"
                    >
                      <FaTrash className="text-sm sm:text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {consultations.length > 3 && (
              <div className="text-center pt-3 sm:pt-4">
                <button
                  onClick={() => navigate(`/dashboard-doctor/patients/${patientId}/consultations`)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                >
                  Ver {consultations.length - 3} consultas más...
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ConsultationsSummary 