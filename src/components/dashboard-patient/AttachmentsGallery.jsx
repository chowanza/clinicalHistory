import React, { useState, useRef, useEffect } from 'react'
import { FaImage, FaDownload, FaTimes, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt, FaEye, FaTrash, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa'

const AttachmentsGallery = ({ 
  attachments = [], 
  title = "Anexos", 
  patientId = null, 
  consultationId = null, 
  onAttachmentDeleted = null,
  onAttachmentsAdded = null
}) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [deletingAttachment, setDeletingAttachment] = useState(null)
  const [isAddingAttachments, setIsAddingAttachments] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const fileInputRef = useRef(null)

  // Forzar re-renderizado cuando cambien los attachments
  useEffect(() => {
    console.log('Attachments changed in AttachmentsGallery:', attachments);
    console.log('Attachments length:', attachments?.length || 0);
    console.log('Will show empty state:', !attachments || attachments.length === 0);
    console.log('Force update count:', forceUpdate);
    
    // Si no hay anexos, forzar un re-renderizado adicional
    if (!attachments || attachments.length === 0) {
      console.log('No attachments, forcing additional re-render');
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 50);
    }
  }, [attachments, forceUpdate]);

  // Monitorear específicamente cuando se elimina el último anexo
  useEffect(() => {
    if (attachments && attachments.length === 0) {
      console.log('=== LAST ATTACHMENT DELETED ===');
      console.log('Rendering empty state immediately');
      
      // Forzar un re-renderizado adicional para asegurar que se muestre el estado vacío
      setTimeout(() => {
        console.log('Forcing final re-render for empty state');
        setForceUpdate(prev => prev + 1);
      }, 100);
    }
  }, [attachments]);

  // Función para limpiar archivos octet-stream
  const cleanOctetStreamFiles = (attachments) => {
    if (!attachments || !Array.isArray(attachments)) return [];
    
    console.log('=== CLEANING OCTET-STREAM FILES IN GALLERY ===');
    console.log('Original attachments:', attachments);
    
    // Solo filtrar anexos que realmente no tienen datos válidos
    const cleanedAttachments = attachments.filter(attachment => {
      // Verificar que el anexo tenga datos básicos
      const hasValidData = attachment.url && attachment.url.length > 50;
      
      console.log('Checking attachment:', {
        name: attachment.originalName || attachment.filename,
        mimeType: attachment.mimeType || attachment.type,
        hasValidData,
        urlLength: attachment.url ? attachment.url.length : 0
      });
      
      // Solo excluir si no tiene datos válidos
      if (!hasValidData) {
        console.log('Removing attachment without valid data:', attachment.originalName || attachment.filename);
        return false;
      }
      
      return true;
    });
    
    console.log('Cleaned attachments:', cleanedAttachments);
    console.log('Removed', attachments.length - cleanedAttachments.length, 'invalid attachments');
    
    return cleanedAttachments;
  };

  // Función para convertir archivo a base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  // Función para manejar la selección de archivos
  const handleFileChange = async (event) => {
    console.log('=== HANDLE FILE CHANGE ===');
    console.log('Files selected:', event.target.files);
    
    const files = Array.from(event.target.files)
    if (files.length === 0) {
      console.log('No files selected');
      return
    }

    console.log('Processing', files.length, 'files');
    setIsAddingAttachments(true)

    try {
      const newAttachments = []
      
      for (const file of files) {
        console.log('Processing file:', file.name, file.type, file.size);
        const base64Data = await fileToBase64(file)
        const attachment = {
          filename: `base64-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          originalName: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          url: base64Data,
          uploadedAt: new Date()
        }
        newAttachments.push(attachment)
        console.log('Created attachment:', attachment);
      }

      console.log('Total new attachments:', newAttachments.length);
      console.log('onAttachmentsAdded callback:', onAttachmentsAdded);

      // Llamar al callback para agregar los nuevos anexos
      if (onAttachmentsAdded) {
        console.log('Calling onAttachmentsAdded with:', newAttachments);
        onAttachmentsAdded(newAttachments)
      } else {
        console.error('onAttachmentsAdded callback is not provided');
      }
    } catch (error) {
      console.error('Error processing files:', error)
      alert('Error al procesar los archivos')
    } finally {
      setIsAddingAttachments(false)
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      console.log('=== END HANDLE FILE CHANGE ===');
    }
  }

  // Limpiar archivos octet-stream antes de procesar
  const cleanedAttachments = cleanOctetStreamFiles(attachments);
  
  console.log('=== ATTACHMENTS GALLERY RENDER ===');
  console.log('Original attachments:', attachments);
  console.log('Cleaned attachments:', cleanedAttachments);
  console.log('Attachments length:', cleanedAttachments ? cleanedAttachments.length : 0);
  console.log('Will show empty state:', !cleanedAttachments || cleanedAttachments.length === 0);
  
  // Manejo de errores para evitar renderizado en blanco
  if (!attachments || !Array.isArray(attachments)) {
    console.warn('Attachments is not an array:', attachments);
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Error al cargar anexos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            No se pudieron cargar los anexos de esta consulta
          </p>
        </div>
      </div>
    );
  }
  
  if (!cleanedAttachments || cleanedAttachments.length === 0) {
    console.log('Rendering empty state - no attachments available');
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No hay anexos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            No se han agregado anexos a esta consulta
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAddingAttachments}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingAttachments ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Procesando...
              </>
            ) : (
              <>
                <FaPlus />
                Agregar Anexos
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
        </div>
      </div>
    )
  }

  // Filtrar solo imágenes para la galería
  const images = cleanedAttachments.filter(attachment => 
    attachment.mimeType && attachment.mimeType.startsWith('image/')
  )

  const handleFileClick = (file) => {
    setSelectedFile(file)
  }

  const closeModal = () => {
    setSelectedFile(null)
  }

  // Navegación entre imágenes
  const goToPreviousImage = () => {
    if (!selectedFile) return
    const currentIndex = images.findIndex(img => img.filename === selectedFile.filename)
    if (currentIndex > 0) {
      setSelectedFile(images[currentIndex - 1])
    }
  }

  const goToNextImage = () => {
    if (!selectedFile) return
    const currentIndex = images.findIndex(img => img.filename === selectedFile.filename)
    if (currentIndex < images.length - 1) {
      setSelectedFile(images[currentIndex + 1])
    }
  }

  // Cerrar con Escape y navegación con flechas
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedFile) return
      
      switch (event.key) {
        case 'Escape':
          closeModal()
          break
        case 'ArrowLeft':
          goToPreviousImage()
          break
        case 'ArrowRight':
          goToNextImage()
          break
        default:
          break
      }
    }

    if (selectedFile) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedFile, images])

  const handleDeleteAttachment = async (attachment) => {
    console.log('=== HANDLE DELETE ATTACHMENT ===');
    console.log('Attachment to delete:', attachment);
    
    if (!window.confirm('¿Seguro que deseas eliminar este anexo?')) {
      console.log('User cancelled deletion');
      return
    }

    console.log('Starting deletion process...');
    setDeletingAttachment(attachment.filename)

    try {
      // Solo manejar anexos de consultas (base64)
      if (consultationId) {
        const url = `http://localhost:4000/api/tasks/${patientId}/consultations/${consultationId}/attachments/${attachment.filename}`
        
        const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          console.log('Deletion successful, calling callback...');
          console.log('onAttachmentDeleted callback exists:', !!onAttachmentDeleted);
          console.log('onAttachmentDeleted callback type:', typeof onAttachmentDeleted);
          
          // Llamar al callback para actualizar la UI
          if (onAttachmentDeleted) {
            console.log('Calling onAttachmentDeleted with filename:', attachment.filename);
            try {
              await onAttachmentDeleted(attachment.filename);
              console.log('onAttachmentDeleted callback completed successfully');
            } catch (error) {
              console.error('Error in onAttachmentDeleted callback:', error);
            }
          } else {
            console.error('onAttachmentDeleted callback is not provided');
          }
        } else {
          const errorData = await response.json()
          console.error('Server error:', errorData);
          alert(`Error al eliminar el anexo: ${errorData.message || 'Error desconocido'}`)
        }
      } else {
        console.log('Local deletion (no backend call)');
        // Para anexos de pacientes, solo actualizar la UI localmente
        if (onAttachmentDeleted) {
          console.log('Calling onAttachmentDeleted for local deletion:', attachment.filename);
          onAttachmentDeleted(attachment.filename)
        } else {
          console.error('onAttachmentDeleted callback is not provided for local deletion');
        }
      }
    } catch (error) {
      console.error('Error deleting attachment:', error)
      alert('Error al eliminar el anexo')
    } finally {
      setDeletingAttachment(null)
    }
  }

  const handleDownload = (attachment) => {
    // Si es base64, crear un blob y descargar
    if (attachment.url && attachment.url.startsWith('data:')) {
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.originalName || attachment.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Si es URL normal
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.originalName || attachment.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return <FaImage className="text-blue-600" />
    } else if (mimeType.includes('pdf')) {
      return <FaFilePdf className="text-red-600" />
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FaFileWord className="text-blue-600" />
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <FaFileExcel className="text-green-600" />
    } else {
      return <FaFileAlt className="text-gray-600" />
    }
  }

  const getFileSize = (size) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(1)} MB`
  }

  // Obtener índice actual de la imagen seleccionada
  const getCurrentImageIndex = () => {
    if (!selectedFile) return -1
    return images.findIndex(img => img.filename === selectedFile.filename)
  }

  const currentImageIndex = getCurrentImageIndex()
  const canGoPrevious = currentImageIndex > 0
  const canGoNext = currentImageIndex < images.length - 1

  console.log('Rendering AttachmentsGallery with attachments:', cleanedAttachments.length);
  
  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title} ({cleanedAttachments.length})
          </h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAddingAttachments}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {isAddingAttachments ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Agregando...
              </>
            ) : (
              <>
                <FaPlus />
                Agregar Anexos
              </>
            )}
          </button>
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        {/* Galería de imágenes */}
        {images.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Imágenes ({images.length})
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Haz clic para ver en tamaño completo
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((attachment, index) => (
                <div
                  key={index}
                  className="group relative aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-md hover:shadow-lg"
                  onClick={() => handleFileClick(attachment)}
                >
                  <img
                    src={attachment.url}
                    alt={attachment.originalName || 'Imagen'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <FaEye className="text-white text-2xl" />
                    </div>
                  </div>
                  {/* Indicador de imagen actual */}
                  {selectedFile && selectedFile.filename === attachment.filename && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Actual
                    </div>
                  )}
                  {/* Número de imagen */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de todos los archivos */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Todos los archivos
          </h4>
          <div className="space-y-2">
            {cleanedAttachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {attachment.originalName || attachment.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getFileSize(attachment.size)} • {attachment.mimeType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {attachment.mimeType.startsWith('image/') && (
                    <button
                      onClick={() => handleFileClick(attachment)}
                      className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Ver imagen"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="p-2 text-green-600 hover:text-green-700 transition-colors"
                    title="Descargar"
                  >
                    <FaDownload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      console.log('=== DELETE BUTTON CLICKED ===');
                      console.log('Attachment to delete:', attachment);
                      handleDeleteAttachment(attachment);
                    }}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    title="Eliminar"
                    disabled={deletingAttachment === attachment.filename}
                  >
                    {deletingAttachment === attachment.filename ? (
                      <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FaTrash className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para ver imagen en tamaño completo con navegación */}
      {selectedFile && selectedFile.mimeType.startsWith('image/') && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón X en la esquina superior derecha */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
              title="Cerrar (ESC)"
            >
              <FaTimes className="text-2xl" />
            </button>
            
            {/* Botón flecha izquierda */}
            {canGoPrevious && (
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-4 transition-all duration-200 hover:scale-110"
                title="Imagen anterior (←)"
              >
                <FaChevronLeft className="text-2xl" />
              </button>
            )}
            
            {/* Botón flecha derecha */}
            {canGoNext && (
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-4 transition-all duration-200 hover:scale-110"
                title="Imagen siguiente (→)"
              >
                <FaChevronRight className="text-2xl" />
              </button>
            )}
            
            <div className="relative max-w-full max-h-full">
              <img
                src={selectedFile.url}
                alt={selectedFile.originalName || 'Imagen'}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                }}
              />
              
              {/* Información de la imagen en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {selectedFile.originalName || selectedFile.filename}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {getFileSize(selectedFile.size)} • {currentImageIndex + 1} de {images.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(selectedFile)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaDownload />
                      Descargar
                    </button>
                  </div>
                </div>
                
                {/* Miniaturas de todas las imágenes */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'border-blue-500 scale-110'
                            : 'border-gray-400 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedFile(image)}
                      >
                        <img
                          src={image.url}
                          alt={image.originalName || 'Miniatura'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AttachmentsGallery 