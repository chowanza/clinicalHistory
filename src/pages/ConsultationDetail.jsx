import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEdit, FaFilePdf, FaPlus, FaDownload } from 'react-icons/fa'
import { usePatients } from '../context/PatientsContext'
import Header from '../components/ui/Header'
import Modal from '../components/ui/Modal'
import FormPatient from '../components/dashboard-doctor/FormPatient'
import AttachmentsGallery from '../components/dashboard-patient/AttachmentsGallery'
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer'
import moment from 'moment'

const ConsultationDetail = () => {
  const { id, consultationId } = useParams()
  const navigate = useNavigate()
  const { patient, getPatient } = usePatients()
  const [isLoading, setIsLoading] = useState(true)
  const [consultation, setConsultation] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showNewConsultationModal, setShowNewConsultationModal] = useState(false)
  const [attachmentsKey, setAttachmentsKey] = useState(0)

  const fetchConsultation = useCallback(async () => {
    try {
      setIsLoading(true)
      // Add cache-busting parameter to ensure fresh data
      const timestamp = Date.now()
      const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations/${consultationId}?_t=${timestamp}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          setConsultation(data)
        } else {
          console.error('Server returned non-JSON response')
          alert('Error: El servidor no está respondiendo correctamente. Verifique que el backend esté ejecutándose.')
          navigate(`/dashboard-doctor/patients/${id}`)
        }
      } else if (response.status === 404) {
        console.error('Consultation not found');
        alert('La consulta no fue encontrada. Puede que haya sido eliminada o no exista.');
        navigate(`/dashboard-doctor/patients/${id}`)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error fetching consultation:', errorData)
        alert(`Error al cargar la consulta: ${errorData.message || 'Error desconocido'}`)
        navigate(`/dashboard-doctor/patients/${id}`)
      }
    } catch (error) {
      console.error('Error fetching consultation:', error)
      if (error.message.includes('Unexpected token')) {
        alert('Error: El servidor no está respondiendo correctamente. Verifique que el backend esté ejecutándose en http://localhost:4000')
      } else {
        alert('Error al cargar la consulta. Verifique su conexión a internet.')
      }
      navigate(`/dashboard-doctor/patients/${id}`)
    } finally {
      setIsLoading(false)
    }
  }, [id, consultationId, navigate])

  useEffect(() => {
    if (id && consultationId) {
      fetchConsultation()
    }
  }, [fetchConsultation])

  // Monitorear cambios en la consulta
  useEffect(() => {
    if (consultation) {
      console.log('Consultation state changed:', {
        id: consultation._id,
        attachmentsCount: consultation.attachments?.length || 0,
        attachments: consultation.attachments
      });
    }
  }, [consultation]);

  const handleEditConsultation = async (formData) => {
    try {
      // Enviar JSON puro para los datos normales de la consulta
      const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations/${consultationId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        await fetchConsultation();
        setShowEditModal(false);
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar la consulta: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
      alert('Error al actualizar la consulta.');
    }
  };

  const handleNewConsultation = async (formData) => {
    try {
      // Enviar JSON puro para los datos normales de la consulta
      const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const newConsultation = await response.json();
        navigate(`/dashboard-doctor/patients/${id}/consultation/${newConsultation._id}`);
      } else {
        const errorData = await response.json();
        alert(`Error al crear la consulta: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating consultation:', error);
      alert('Error al crear la consulta.');
    }
  };

  // Función para calcular la edad del paciente
  const calculatePatientAge = () => {
    if (!patient?.birthDate) return null;
    
    const birthDate = moment(patient.birthDate);
    const now = moment();
    
    const years = now.diff(birthDate, 'years');
    const months = now.diff(birthDate, 'months') % 12;
    
    if (years > 0) {
      return `${years} años`;
    } else if (months > 0) {
      return `${months} meses`;
    } else {
      const days = now.diff(birthDate, 'days');
      return `${days} días`;
    }
  };

  // Función para determinar qué fila de la tabla resaltar basada en la edad
  const getHighlightedRow = () => {
    if (!patient?.birthDate) return null;
    
    const birthDate = moment(patient.birthDate);
    const now = moment();
    const ageInMonths = now.diff(birthDate, 'months');
    const ageInYears = now.diff(birthDate, 'years');
    
    // Mapeo de edades a filas de la tabla
    if (ageInMonths < 3) return 'Recién nacido';
    if (ageInMonths < 6) return '3 meses';
    if (ageInMonths < 9) return '6 meses';
    if (ageInMonths < 12) return '12 meses';
    if (ageInYears < 2) return '2 años';
    if (ageInYears < 5) return '5 años';
    if (ageInYears < 10) return '10 años';
    if (ageInYears < 15) return '15 años';
    if (ageInYears < 19) return '19 años';
    return '19 años'; // Para adultos
  };

  const highlightedRow = getHighlightedRow();
  const patientAge = calculatePatientAge();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!consultation) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Consulta no encontrada
          </h2>
          <button
            onClick={() => navigate(`/dashboard-doctor/patients/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Perfil
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      
      {/* Modal para editar consulta */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} size='large'>
        <button
          onClick={() => setShowEditModal(false)}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-6 right-0'
        >
          Cerrar
        </button>
        <FormPatient
          patientData={{ _id: id }}
          consultationData={consultation}
          closeModal={() => setShowEditModal(false)}
          onSubmit={handleEditConsultation}
          isConsultationMode
        />
      </Modal>

      {/* Modal para nueva consulta */}
      <Modal isOpen={showNewConsultationModal} onClose={() => setShowNewConsultationModal(false)} size='large'>
        <button
          onClick={() => setShowNewConsultationModal(false)}
          className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-6 right-0'
        >
          Cerrar
        </button>
        <FormPatient
          patientData={{ _id: id }}
          consultationData={consultation}
          closeModal={() => setShowNewConsultationModal(false)}
          onSubmit={handleNewConsultation}
          isConsultationMode
          isNewConsultation
        />
      </Modal>

      <main className='w-full min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark pt-2 pb-10'>
        <div className="w-full max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(`/dashboard-doctor/patients/${id}`)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <FaArrowLeft />
                  Volver al Perfil
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Consulta - {consultation.consultMotive}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {moment(consultation.consultationDate).format('DD/MM/YYYY HH:mm')}
                  </p>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaEdit />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => setShowNewConsultationModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaPlus />
                  <span className="hidden sm:inline">Nueva Consulta</span>
                </button>
                <PDFDownloadLink
                  document={<ConsultationPDF consultation={consultation} patient={patient} />}
                  fileName={`consulta-${moment(consultation.consultationDate).format('YYYY-MM-DD')}.pdf`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaDownload />
                  <span className="hidden sm:inline">PDF</span>
                </PDFDownloadLink>
              </div>
            </div>
          </div>

          {/* Contenido de la consulta */}
          <div className="grid gap-6">
            {/* Historial Médico */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Historial Médico
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Motivo de Consulta
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.consultMotive}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Examen Físico
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.physicalExam}
                  </p>
                </div>
              </div>
            </div>

            {/* Medidas */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Medidas Antropométricas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Peso
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.weight} kg
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Talla
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.size} cm
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Perímetro Cefálico
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.pc} cm
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Circunferencia Abdominal
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.abdominalCircumference} cm
                  </p>
                </div>
              </div>

              {/* Tabla de referencia de peso y talla */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                  Guía de referencia de peso y talla para niños y niñas venezolanos (MSAS 1994)
                  {patientAge && (
                    <span className="text-sm font-normal text-blue-600 dark:text-blue-400 ml-2">
                      (Edad del paciente: {patientAge})
                    </span>
                  )}
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 px-2 py-1 text-center">Edad</th>
                        <th className="border border-gray-300 px-2 py-1 text-center" colSpan="3">Peso (kg) - NIÑA</th>
                        <th className="border border-gray-300 px-2 py-1 text-center" colSpan="3">Talla (cm) - NIÑA</th>
                        <th className="border border-gray-300 px-2 py-1 text-center" colSpan="3">Peso (kg) - NIÑO</th>
                        <th className="border border-gray-300 px-2 py-1 text-center" colSpan="3">Talla (cm) - NIÑO</th>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-600">
                        <th className="border border-gray-300 px-1 py-1 text-center"></th>
                        <th className="border border-gray-300 px-1 py-1 text-center">10%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">50%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">90%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">10%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">50%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">90%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">10%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">50%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">90%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">10%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">50%</th>
                        <th className="border border-gray-300 px-1 py-1 text-center">90%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={highlightedRow === 'Recién nacido' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">Recién nacido</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">2.7</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">3.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">3.9</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">46.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">49.3</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">51.7</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">2.7</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">3.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">3.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">47.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">50.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">52.5</td>
                      </tr>
                      <tr className={highlightedRow === '3 meses' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">3 meses</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">4.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">5.7</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">6.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">56.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">59.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">63.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">5.1</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">6.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">7.1</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">57.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">61.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">64.5</td>
                      </tr>
                      <tr className={highlightedRow === '6 meses' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">6 meses</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">6.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">7.3</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">8.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">62.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">65.7</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">68.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">6.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">7.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">9.1</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">64.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">67.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">70.9</td>
                      </tr>
                      <tr className={highlightedRow === '12 meses' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">12 meses</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">7.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">8.9</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">11.1</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">69.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">73.3</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">77.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">8.1</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">9.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">11.1</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">70.7</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">74.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">78.7</td>
                      </tr>
                      <tr className={highlightedRow === '2 años' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">2 años</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">10.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">12.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">14.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">80.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">84.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">89.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">10.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">12.9</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">15.3</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">81.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">86.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">90.8</td>
                      </tr>
                      <tr className={highlightedRow === '5 años' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">5 años</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">15.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">18.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">21.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">100.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">106.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">111.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">16.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">19.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">23.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">102.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">107.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">113.0</td>
                      </tr>
                      <tr className={highlightedRow === '10 años' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">10 años</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">24.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">29.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">35.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">125.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">131.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">138.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">25.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">31.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">37.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">127.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">134.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">140.5</td>
                      </tr>
                      <tr className={highlightedRow === '15 años' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">15 años</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">38.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">46.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">56.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">148.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">155.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">163.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">42.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">51.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">63.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">152.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">160.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">167.5</td>
                      </tr>
                      <tr className={highlightedRow === '19 años' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : ''}>
                        <td className="border border-gray-300 px-1 py-1 text-center font-medium">19 años</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">44.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">52.7</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">64.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">150.5</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">158.0</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">165.4</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">51.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">60.8</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">74.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">162.2</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">170.6</td>
                        <td className="border border-gray-300 px-1 py-1 text-center">179.9</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  * Valores de Referencia de la Población Venezolana M.S.A.S. Gaceta Oficial N° 35424. 18 de Marzo 1994.
                </p>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Diagnóstico y Tratamiento
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Diagnóstico
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.diagnostic}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tratamiento
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.treatment}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exámenes Complementarios
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.exams}
                  </p>
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Información Médica Adicional
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Referencia Médica
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.medicalReference}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Información Médica Compartida
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.medicalInformShared}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Viaje Médico
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {consultation.medicalTrip}
                  </p>
                </div>
              </div>
            </div>

            {/* Anexos */}
            {consultation && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Anexos
                </h3>
                <AttachmentsGallery 
                  key={`attachments-${consultation._id}-${(consultation.attachments || []).length}-${attachmentsKey}`}
                  attachments={consultation.attachments || []} 
                  title="Anexos de la Consulta"
                  patientId={id}
                  consultationId={consultationId}
                onAttachmentDeleted={async (filename) => {
                  console.log('=== ON ATTACHMENT DELETED (ConsultationDetail) ===');
                  console.log('Filename to delete:', filename);
                  
                  // Simplemente recargar los datos de la consulta desde el servidor
                  try {
                    console.log('Fetching updated consultation from server...');
                    await fetchConsultation();
                    console.log('Consultation data refreshed successfully');
                  } catch (error) {
                    console.error('Error refreshing consultation data:', error);
                  }
                }}
                onAttachmentsAdded={async (newAttachments) => {
                  console.log('=== ON ATTACHMENTS ADDED ===');
                  console.log('New attachments received:', newAttachments);
                  console.log('Current consultation:', consultation);
                  
                  try {
                    // Preparar los datos de la consulta con los nuevos anexos
                    const currentAttachments = consultation.attachments || [];
                    const allAttachments = [...currentAttachments, ...newAttachments];
                    
                    console.log('Current attachments count:', currentAttachments.length);
                    console.log('New attachments count:', newAttachments.length);
                    console.log('Total attachments count:', allAttachments.length);
                    
                    // Convertir los anexos al formato esperado por el backend
                    const formattedAttachments = allAttachments.map(attachment => ({
                      name: attachment.originalName || attachment.filename,
                      type: attachment.mimeType,
                      size: attachment.size,
                      data: attachment.url // El backend espera 'data' en lugar de 'url'
                    }));
                    
                    // Actualizar la consulta en el servidor con los nuevos anexos
                    const updateData = {
                      ...consultation,
                      attachments: formattedAttachments
                    };
                    
                    console.log('Sending update to server:', updateData);
                    
                    const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations/${consultationId}`, {
                      method: 'PUT',
                      credentials: 'include',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(updateData)
                    });
                    
                    if (response.ok) {
                      const updatedConsultation = await response.json();
                      console.log('Consultation updated successfully:', updatedConsultation);
                      
                      setConsultation(updatedConsultation);
                      
                      // Disparar evento personalizado para notificar el cambio
                      window.dispatchEvent(new CustomEvent('consultationAttachmentsChanged', {
                        detail: {
                          consultationId: consultationId,
                          patientId: id,
                          attachments: updatedConsultation.attachments
                        }
                      }));
                    } else {
                      console.error('Failed to update consultation on server');
                      const errorData = await response.json().catch(() => ({}));
                      console.error('Server error:', errorData);
                      
                      // Fallback: actualizar localmente
                      setConsultation(prev => ({
                        ...prev,
                        attachments: [...(prev.attachments || []), ...newAttachments]
                      }));
                    }
                  } catch (error) {
                    console.error('Error updating consultation:', error);
                    // Fallback: actualizar localmente
                    setConsultation(prev => ({
                      ...prev,
                      attachments: [...(prev.attachments || []), ...newAttachments]
                    }));
                  }
                }}
              />
            </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

// Componente temporal para PDF de consulta
const ConsultationPDF = ({ consultation, patient }) => {
  return (
    <Document>
      <Page size="A4" style={{ padding: '20px', fontFamily: 'Helvetica', fontSize: 12 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Consulta Médica
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Fecha: {moment(consultation.consultationDate).format('DD/MM/YYYY HH:mm')}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 10 }}>
            Paciente: {patient?.firstNames} {patient?.lastNames}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Fecha de Nacimiento: {patient?.birthDate}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Teléfono: {patient?.phone}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Dirección: {patient?.address}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Nombre del Padre: {patient?.dadName}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Nombre de la Madre: {patient?.momName}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Obstetra/Ginecólogo: {patient?.obstetrician}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Historia Neonatal: {patient?.neonatal}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Historia Personal: {patient?.personal}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Historia Familiar: {patient?.familiar}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Motivo de Consulta: {consultation.consultMotive}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Examen Físico: {consultation.physicalExam}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Peso: {consultation.weight} kg
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Talla: {consultation.size} cm
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            PC: {consultation.pc} cm
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Circ. Abdominal: {consultation.abdominalCircumference} cm
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Diagnóstico: {consultation.diagnostic}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Tratamiento: {consultation.treatment}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Exámenes Complementarios: {consultation.exams}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Referencia Médica: {consultation.medicalReference}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Información Médica Compartida: {consultation.medicalInformShared}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Viaje Médico: {consultation.medicalTrip}
          </Text>
          <View style={{ marginTop: 40, borderTop: '1px solid #000', paddingTop: 10, width: 300, alignSelf: 'flex-end', textAlign: 'center' }}>
            <Text>Dra. Eunice Brito G.</Text>
            <Text>Pediatra - Neonatólogo</Text>
            <Text>M.P.P.S: 53988 / CM 4.699</Text>
            <Text>C.I.:V-8.918.808</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ConsultationDetail 