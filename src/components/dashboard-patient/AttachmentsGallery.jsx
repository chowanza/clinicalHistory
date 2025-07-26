import React, { useState } from 'react'
import { FaImage, FaDownload, FaTimes } from 'react-icons/fa'

const AttachmentsGallery = ({ attachments = [], title = "Anexos" }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  if (!attachments || attachments.length === 0) {
    return null
  }

  // Filtrar solo imágenes
  const images = attachments.filter(attachment => 
    attachment.mimeType && attachment.mimeType.startsWith('image/')
  )

  if (images.length === 0) {
    return null
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const handleDownload = (attachment) => {
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.originalName || attachment.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaImage className="text-blue-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({images.length} imagen{images.length !== 1 ? 'es' : ''})
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((attachment, index) => (
            <div
              key={attachment._id || index}
              className="relative group cursor-pointer"
              onClick={() => handleImageClick(attachment)}
            >
              <div className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                <img
                  src={attachment.url}
                  alt={attachment.originalName || 'Imagen'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <FaImage className="text-white text-2xl" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {attachment.originalName || attachment.filename}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {(attachment.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para ver imagen en tamaño completo */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
            <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.originalName || 'Imagen'}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {selectedImage.originalName || selectedImage.filename}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaDownload />
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AttachmentsGallery 