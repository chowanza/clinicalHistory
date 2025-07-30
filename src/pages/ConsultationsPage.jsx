import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaPlus, FaTrash, FaEye, FaCalendarAlt, FaArrowLeft, FaEdit, FaSort, FaSortUp, FaSortDown, FaFilter, FaTimes } from 'react-icons/fa'
import moment from 'moment'
import Header from '../components/ui/Header'
import FormPatient from '../components/dashboard-doctor/FormPatient'
import Modal from '../components/ui/Modal'
import AttachmentsGallery from '../components/dashboard-patient/AttachmentsGallery'

const ConsultationsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState([])
  const [filteredConsultations, setFilteredConsultations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' o 'desc'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConsultation, setSelectedConsultation] = useState(null)

  console.log('ConsultationsPage - id from params:', id)
  console.log('ConsultationsPage - typeof id:', typeof id)
  console.log('ConsultationsPage - id is truthy:', !!id)

  useEffect(() => {
    fetchConsultations()
  }, [id])

  // Escuchar eventos de cambios en anexos
  useEffect(() => {
    const handleConsultationAttachmentsChanged = (event) => {
      const { consultationId, patientId, attachments } = event.detail;
      
      // Solo actualizar si es el paciente actual
      if (patientId === id) {
        console.log('Updating consultation attachments from event in ConsultationsPage:', consultationId, attachments);
        setConsultations(prev => 
          prev.map(consultation => 
            consultation._id === consultationId 
              ? { ...consultation, attachments }
              : consultation
          )
        );
      }
    };

    window.addEventListener('consultationAttachmentsChanged', handleConsultationAttachmentsChanged);

    return () => {
      window.removeEventListener('consultationAttachmentsChanged', handleConsultationAttachmentsChanged);
    };
  }, [id]);

  useEffect(() => {
    console.log('=== CONSULTATIONS PAGE MOUNTED ===')
    console.log('id from useParams:', id)
    console.log('id type:', typeof id)
    console.log('id is valid:', id && typeof id === 'string' && id.length > 0)
  }, [])

  useEffect(() => {
    // Filtrar y ordenar consultas
    let filtered = [...consultations]
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(consultation => 
        consultation.consultMotive.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.diagnostic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.consultationNumber.toString().includes(searchTerm)
      )
    }
    
    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.consultationDate)
      const dateB = new Date(b.consultationDate)
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
    
    setFilteredConsultations(filtered)
  }, [consultations, searchTerm, sortOrder])

  const fetchConsultations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations`, {
        credentials: 'include'
      })
      if (response.status === 304) {
        // Si hay caché local, úsala; si no, muestra mensaje
        // Aquí podrías usar localStorage o un mensaje
        setIsLoading(false)
        return
      }
      if (response.ok) {
        const data = await response.json()
        setConsultations(data)
      } else {
        setConsultations([])
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
      setConsultations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConsultation = () => {
    console.log('=== HANDLE NEW CONSULTATION ===')
    console.log('id from params:', id)
    console.log('id type:', typeof id)
    console.log('id is valid:', id && typeof id === 'string' && id.length > 0)
    
    // Si hay consultas, copiar los datos de la consulta más reciente (excepto attachments)
    if (consultations.length > 0) {
      const lastConsultation = consultations[0]; // La primera del array es la más reciente
      // Crear una copia de la consulta más reciente pero con fecha actual y sin attachments
      const consultationCopy = {
        consultationDate: new Date().toISOString().slice(0, 16), // Formato datetime-local
        consultMotive: lastConsultation.consultMotive || '',
        physicalExam: lastConsultation.physicalExam || '',
        weight: lastConsultation.weight || '',
        size: lastConsultation.size || '',
        pc: lastConsultation.pc || '',
        abdominalCircumference: lastConsultation.abdominalCircumference || '',
        diagnostic: lastConsultation.diagnostic || '',
        treatment: lastConsultation.treatment || '',
        exams: lastConsultation.exams || '',
        medicalReference: lastConsultation.medicalReference || '',
        medicalInformShared: lastConsultation.medicalInformShared || '',
        medicalTrip: lastConsultation.medicalTrip || '',
        // NO copiar attachments ni _id
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

  const handleDeleteConsultation = async (consultationId) => {
    if (!consultationId) {
      console.error('No consultationId provided for deletion');
      alert('Error: No se pudo identificar la consulta para eliminar.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations/${consultationId}`, {
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
        setShowFormModal(false);
        setEditingConsultation(null);
        // Si es una nueva consulta, navegar al dashboard del paciente
        if (isNewConsultation) {
          navigate(`/dashboard-doctor/patients/${id}`);
        }
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        alert(`Error al guardar la consulta: ${errorData.message || 'Error desconocido'}`)
      }
      console.log('=== END CONSULTATION SUBMIT DEBUG ===')
    } catch (error) {
      console.error('Error in consultation submit:', error)
      alert('Error al guardar la consulta')
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const handleConsultationClick = (consultation) => {
    setSelectedConsultation(consultation)
  }

  const closeConsultationDetail = () => {
    setSelectedConsultation(null)
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/dashboard-doctor/patients/${id}`)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <FaArrowLeft />
                Volver al Paciente
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Gestión de Consultas
              </h1>
            </div>
            <button
              onClick={handleNewConsultation}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors shadow"
            >
              <FaPlus />
              Nueva Consulta
            </button>
          </div>

          {/* Filtros y controles */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por motivo, diagnóstico o número de consulta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              
              {/* Ordenamiento */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ordenar:</span>
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <FaSort />
                  {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  {sortOrder === 'asc' ? 'Más antigua' : 'Más reciente'}
                </button>
              </div>
            </div>
          </div>

          {/* Lista de consultas */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Consultas ({filteredConsultations.length})
                </h2>
                {searchTerm && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Resultados para: "{searchTerm}"
                  </span>
                )}
              </div>

              {filteredConsultations.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <FaCalendarAlt className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                    {searchTerm ? 'No se encontraron consultas con los criterios de búsqueda' : 'No hay consultas registradas para este paciente'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={handleNewConsultation}
                      className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      Crear Primera Consulta
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                  {filteredConsultations.map((consultation, index) => (
                    <div
                      key={consultation._id}
                      className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleConsultationClick(consultation)}
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
                          
                          {/* Indicador de anexos */}
                          <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                            <FaEye />
                            {consultation.attachments ? consultation.attachments.length : 0} anexo{(consultation.attachments ? consultation.attachments.length : 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditConsultation(consultation);
                            }}
                            className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 transition-colors"
                            title="Editar consulta"
                          >
                            <FaEdit className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConsultation(consultation._id);
                            }}
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
        </div>
      </main>

      {/* Modal para nueva/editar consulta */}
      {showFormModal && (
        <Modal onClose={() => setShowFormModal(false)}>
          {console.log('=== MODAL RENDERING ===')}
          {console.log('id from params:', id)}
          {console.log('id type:', typeof id)}
          {console.log('id is valid:', id && typeof id === 'string' && id.length > 0)}
          {(() => {
            const patientDataToPass = id ? { _id: id } : null;
            console.log('patientDataToPass:', patientDataToPass);
            return null;
          })()}
          <FormPatient
            closeModal={() => setShowFormModal(false)}
            patientData={id && typeof id === 'string' && id.length > 0 ? { _id: id } : null}
            consultationData={editingConsultation}
            isConsultationMode={true}
            isNewConsultation={!editingConsultation || !editingConsultation._id}
            onSubmit={handleConsultationSubmit}
          />
        </Modal>
      )}

      {/* Modal para ver detalles de consulta */}
      {selectedConsultation && (
        <Modal onClose={closeConsultationDetail}>
          <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Consulta {selectedConsultation.consultationNumber}
              </h2>
              <button
                onClick={closeConsultationDetail}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Información General</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Fecha:</span>
                      <span className="ml-2 text-gray-800 dark:text-white">
                        {moment(selectedConsultation.consultationDate).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Motivo:</span>
                      <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.consultMotive}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Examen Físico:</span>
                      <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.physicalExam}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Medidas</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Peso:</span>
                      <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.weight}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Talla:</span>
                      <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.size}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">PC:</span>
                      <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.pc}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Circ. Abdominal:</span>
                      <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.abdominalCircumference}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnóstico y tratamiento */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Diagnóstico y Tratamiento</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Diagnóstico:</span>
                    <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.diagnostic}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Tratamiento:</span>
                    <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.treatment}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Exámenes:</span>
                    <span className="ml-2 text-gray-800 dark:text-white">{selectedConsultation.exams}</span>
                  </div>
                </div>
              </div>

              {/* Anexos */}
              <AttachmentsGallery 
                key={`attachments-${selectedConsultation._id}-${(selectedConsultation.attachments || []).length}`}
                attachments={selectedConsultation.attachments || []}
                title="Anexos de la Consulta"
                patientId={id}
                consultationId={selectedConsultation._id}
                                onAttachmentDeleted={async (filename) => {
                  console.log('=== ON ATTACHMENT DELETED (ConsultationsPage) ===');
                  console.log('Filename to delete:', filename);
                  console.log('Current attachments count:', selectedConsultation.attachments?.length || 0);
                  
                  try {
                    // Esperar un momento para que el servidor procese la eliminación
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Obtener la consulta actualizada del servidor
                    const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations/${selectedConsultation._id}`, {
                      credentials: 'include'
                    });
                    
                    if (response.ok) {
                      const updatedConsultation = await response.json();
                      console.log('Got updated consultation from server:', updatedConsultation);
                      console.log('Server attachments count:', updatedConsultation.attachments?.length || 0);
                      
                      // Verificar que el anexo fue realmente eliminado
                      const wasDeleted = !updatedConsultation.attachments.some(att => att.filename === filename);
                      console.log('Was attachment deleted from server?', wasDeleted);
                      
                      if (wasDeleted) {
                        console.log('Server confirms deletion, updating state');
                        setSelectedConsultation(updatedConsultation);
                        
                        // También actualizar en la lista de consultas
                        setConsultations(prev => prev.map(consultation => 
                          consultation._id === selectedConsultation._id 
                            ? updatedConsultation
                            : consultation
                        ));
                      } else {
                        console.log('Attachment still exists on server, keeping current state');
                        // El anexo aún existe en el servidor, mantener el estado actual
                      }
                      
                      console.log('Consultation sync completed');
                    } else {
                      console.error('Failed to get updated consultation from server');
                      // Fallback: actualizar localmente
                      setSelectedConsultation(prev => ({
                        ...prev,
                        attachments: prev.attachments.filter(att => att.filename !== filename)
                      }));
                      setConsultations(prev => prev.map(consultation => 
                        consultation._id === selectedConsultation._id 
                          ? {
                              ...consultation,
                              attachments: consultation.attachments.filter(att => att.filename !== filename)
                            }
                          : consultation
                      ));
                    }
                  } catch (error) {
                    console.error('Error syncing with server:', error);
                    // Fallback: actualizar localmente
                    setSelectedConsultation(prev => ({
                      ...prev,
                      attachments: prev.attachments.filter(att => att.filename !== filename)
                    }));
                    setConsultations(prev => prev.map(consultation => 
                      consultation._id === selectedConsultation._id 
                        ? {
                            ...consultation,
                            attachments: consultation.attachments.filter(att => att.filename !== filename)
                          }
                        : consultation
                    ));
                  }
                }}
                onAttachmentsAdded={async (newAttachments) => {
                  try {
                    // Preparar los datos de la consulta con los nuevos anexos
                    const currentAttachments = selectedConsultation.attachments || [];
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
                      ...selectedConsultation,
                      attachments: formattedAttachments
                    };
                    
                    console.log('Sending update to server:', updateData);
                    
                    const response = await fetch(`http://localhost:4000/api/tasks/${id}/consultations/${selectedConsultation._id}`, {
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
                      setSelectedConsultation(updatedConsultation);
                      
                      // También actualizar en la lista de consultas
                      setConsultations(prev => prev.map(consultation => 
                        consultation._id === selectedConsultation._id 
                          ? updatedConsultation
                          : consultation
                      ));
                    } else {
                      console.error('Failed to update consultation on server');
                      const errorData = await response.json().catch(() => ({}));
                      console.error('Server error:', errorData);
                      
                      // Fallback: actualizar localmente
                      setSelectedConsultation(prev => ({
                        ...prev,
                        attachments: [...(prev.attachments || []), ...newAttachments]
                      }));
                      setConsultations(prev => prev.map(consultation => 
                        consultation._id === selectedConsultation._id 
                          ? {
                              ...consultation,
                              attachments: [...(consultation.attachments || []), ...newAttachments]
                            }
                          : consultation
                      ));
                    }
                  } catch (error) {
                    console.error('Error updating consultation:', error);
                    // Fallback: actualizar localmente
                    setSelectedConsultation(prev => ({
                      ...prev,
                      attachments: [...(prev.attachments || []), ...newAttachments]
                    }));
                    setConsultations(prev => prev.map(consultation => 
                      consultation._id === selectedConsultation._id 
                        ? {
                            ...consultation,
                            attachments: [...(consultation.attachments || []), ...newAttachments]
                          }
                        : consultation
                    ));
                  }
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ConsultationsPage 