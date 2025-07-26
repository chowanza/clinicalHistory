import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa'
import moment from 'moment'
import Header from '../components/ui/Header'

const PatientConsultationsList = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPatientAndConsultations()
  }, [id])

  const fetchPatientAndConsultations = async () => {
    try {
      setIsLoading(true)
      
      // Fetch patient data
      const patientResponse = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        credentials: 'include'
      })
      if (patientResponse.ok) {
        const patientData = await patientResponse.json()
        setPatient(patientData)
      }
      
      // Fetch consultations
      const consultationsResponse = await fetch(`http://localhost:4000/api/tasks/${id}/consultations`, {
        credentials: 'include'
      })
      if (consultationsResponse.ok) {
        const consultationsData = await consultationsResponse.json()
        setConsultations(consultationsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewConsultation = (consultationId) => {
    navigate(`/dashboard-doctor/patients/${id}/consultation/${consultationId}`)
  }

  const handleViewAllConsultations = () => {
    navigate(`/dashboard-doctor/patients/${id}/consultations`)
  }

  if (isLoading) {
    return (
      <>
        <Header />
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
      </>
    )
  }

  return (
    <>
      <Header />
      <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen pt-2 pb-10'>
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            {/* Header con información del paciente */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard-doctor')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <FaArrowLeft />
                  Volver
                </button>
                <div className="flex items-center gap-3">
                  <FaUser className="text-2xl text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {patient?.firstNames} {patient?.lastNames}
                    </h1>
                    {patient?.lastConsultationDate && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Última consulta: {moment(patient.lastConsultationDate).format('DD/MM/YYYY HH:mm')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleViewAllConsultations}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaCalendarAlt />
                Gestionar Consultas
              </button>
            </div>

            {/* Lista de consultas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Historial de Consultas
              </h2>
              
              {consultations.length === 0 ? (
                <div className="text-center py-8">
                  <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No hay consultas registradas para este paciente
                  </p>
                  <button
                    onClick={handleViewAllConsultations}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Crear Primera Consulta
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.map((consultation, index) => (
                    <div
                      key={consultation._id}
                      className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewConsultation(consultation._id)}
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
                            <span>Peso: {consultation.weight}</span>
                            <span>Talla: {consultation.size}</span>
                            <span>PC: {consultation.pc}</span>
                            <span>Circ. Abdominal: {consultation.abdominalCircumference}</span>
                          </div>
                        </div>
                        <div className="text-blue-600">
                          <FaCalendarAlt />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default PatientConsultationsList 