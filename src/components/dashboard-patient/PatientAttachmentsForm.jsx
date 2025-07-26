import { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';

const PatientAttachmentsForm = ({ patientId, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef();

  // Cargar archivos actuales del paciente
  const fetchAttachments = async () => {
    const res = await fetch(`/api/tasks/${patientId}`);
    if (res.ok) {
      const data = await res.json();
      setAttachments(data.attachments || []);
    }
  };

  // Cargar al montar
  useState(() => { fetchAttachments(); }, [patientId]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return;
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('attachments', file));
    const res = await fetch(`/api/tasks/${patientId}/attachments`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    setUploading(false);
    setSelectedFiles([]);
    fileInputRef.current.value = '';
    if (res.ok) {
      fetchAttachments();
      if (onUpload) onUpload();
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm('¿Seguro que deseas eliminar este archivo?')) return;
    await fetch(`/api/tasks/${patientId}/attachments/${file.filename}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchAttachments();
  };

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <form onSubmit={handleUpload} className='flex flex-col gap-2'>
        <label className='font-semibold'>Agregar Anexos</label>
        <input
          type='file'
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className='border p-2 rounded'
        />
        <button
          type='submit'
          disabled={uploading || !selectedFiles.length}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors shadow mt-2'
        >
          <FaUpload /> {uploading ? 'Subiendo...' : 'Subir'}
        </button>
      </form>
      {attachments.length > 0 && (
        <div className='mt-4'>
          <h4 className='font-semibold mb-2'>Archivos Subidos</h4>
          <div className='flex flex-wrap gap-4'>
            {attachments.map((file, idx) => (
              <div key={idx} className='flex flex-col items-center'>
                {file.mimeType && file.mimeType.startsWith('image') ? (
                  <img src={file.url} alt={file.originalName} className='w-20 h-20 object-cover rounded shadow mb-1' />
                ) : file.mimeType && file.mimeType.includes('pdf') ? (
                  <FaFilePdf className='w-10 h-10 text-red-600 mb-1' />
                ) : file.mimeType && file.mimeType.includes('word') ? (
                  <FaFileWord className='w-10 h-10 text-blue-600 mb-1' />
                ) : file.mimeType && file.mimeType.includes('excel') ? (
                  <FaFileExcel className='w-10 h-10 text-green-600 mb-1' />
                ) : (
                  <FaFileAlt className='w-10 h-10 text-gray-600 mb-1' />
                )}
                <a href={file.url} download className='text-xs text-purple-600 underline mb-1'>Descargar</a>
                <button
                  onClick={() => handleDelete(file)}
                  className='text-xs text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded px-2 py-1 flex items-center gap-1 hover:from-purple-700 hover:to-purple-900 transition-colors shadow mt-1'
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAttachmentsForm; 