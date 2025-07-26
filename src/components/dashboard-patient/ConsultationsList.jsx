import React, { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaEye, FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const ConsultationsList = ({ patientId, onNewConsultation, onDeleteConsultation }) => {
  const [consultations, setConsultations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchConsultations()
  }, [patientId])

  const fetchConsultations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${patientId}/consultations`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setConsultations(data)
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewConsultation = (consultationId) => {
    navigate(`/dashboard-doctor/patients/${patientId}/consultation/${consultationId}`)
  }

  const handleDeleteConsultation = async (consultationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${patientId}/consultations/${consultationId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (response.ok) {
          setConsultations(prev => prev.filter(c => c._id !== consultationId))
          onDeleteConsultation && onDeleteConsultation(consultationId)
        }
      } catch (error) {
        console.error('Error deleting consultation:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Consultas del Paciente
          </h2>
          <button
            onClick={onNewConsultation}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors shadow"
          >
            <FaPlus />
            Nueva Consulta
          </button>
        </div>

        {consultations.length === 0 ? (
          <div className="text-center py-8">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay consultas registradas para este paciente
            </p>
            <button
              onClick={onNewConsultation}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primera Consulta
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {consultations.map((consultation, index) => (
              <div
                key={consultation._id}
                className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Consulta {consultation.consultationNumber}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {moment(consultation.consultationDate).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                      Motivo: {consultation.consultMotive}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Diagnóstico: {consultation.diagnostic}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Peso: {consultation.weight} kg</span>
                      <span>Talla: {consultation.size} cm</span>
                      <span>PC: {consultation.pc} cm</span>
                      <span>Circ. Abdominal: {consultation.abdominalCircumference} cm</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewConsultation(consultation._id)}
                      className="p-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors shadow"
                      title="Ver consulta"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDeleteConsultation(consultation._id)}
                      className="p-2 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-lg hover:from-pink-700 hover:to-red-700 transition-colors shadow"
                      title="Eliminar consulta"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsultationsList 