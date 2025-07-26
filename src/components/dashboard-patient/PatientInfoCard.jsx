import React from 'react'
import PropTypes from 'prop-types'
import { FaPhone, FaEnvelope, FaUserShield, FaTrash, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import Skeleton from '@mui/material/Skeleton'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import PatientAttachmentsForm from './PatientAttachmentsForm';

const PatientContact = ({
  title = 'Contact Information',
  titleIcon = <FaUserShield />,
  sections = [
    {
      title: 'Phone',
      icon: <FaPhone />,
      content: '123-456-7890',
      colSpan: 1,
    },
    {
      title: 'Email',
      icon: <FaEnvelope />,
      content: 'patient@example.com',
      colSpan: 1,
    },
    {
      title: 'Emergency Contact',
      icon: <FaUserShield />,
      content: 'John Doe (Father)\n555-123-4567',
      colSpan: 2,
    },
  ],
  isLoading = false,
}) => {
  const { id } = useParams();
  const [deleting, setDeleting] = useState(null);
  const handleDelete = async (file) => {
    if (!window.confirm('¿Seguro que deseas eliminar este archivo?')) return;
    setDeleting(file.filename);
    try {
      const res = await fetch(`/api/tasks/${id}/attachments/${file.filename}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        if (patient.attachments) {
          patient.attachments = patient.attachments.filter(att => att.filename !== file.filename);
        }
        setDeleting(null);
        // Forzar re-render si es necesario
      }
    } catch (error) {
      setDeleting(null);
      alert('Error eliminando archivo');
    }
  };

  if (isLoading) {
    return (
      <section className='w-full py-3 px-7 bg-white dark:bg-slate-800 rounded-lg shadow-md flex gap-5 flex-col'>
        {/* Skeleton para el título */}
        <div className='border-b border-gray-300 p-4'>
          <Skeleton
            variant='text'
            width={200}
            height={32}
            className='dark:bg-slate-700'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Skeleton para teléfono */}
          <div className='p-4 border-b border-gray-300'>
            <Skeleton
              variant='text'
              width={100}
              height={24}
              className='dark:bg-slate-700 mb-2'
            />
            <Skeleton
              variant='text'
              width={150}
              height={28}
              className='dark:bg-slate-700'
            />
          </div>

          {/* Skeleton para email */}
          <div className='p-4 border-b border-gray-300'>
            <Skeleton
              variant='text'
              width={100}
              height={24}
              className='dark:bg-slate-700 mb-2'
            />
            <Skeleton
              variant='text'
              width={180}
              height={28}
              className='dark:bg-slate-700'
            />
          </div>

          {/* Skeleton para contacto de emergencia */}
          <div className='p-4 col-span-2'>
            <Skeleton
              variant='text'
              width={150}
              height={24}
              className='dark:bg-slate-700 mb-2'
            />
            <Skeleton
              variant='text'
              width={250}
              height={28}
              className='dark:bg-slate-700 mb-1'
            />
            <Skeleton
              variant='text'
              width={150}
              height={28}
              className='dark:bg-slate-700'
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='w-full py-3 px-4 sm:px-7 bg-white rounded-lg shadow-md flex gap-3 sm:gap-5 flex-col border-2 border-purple-200'>
      <h2 className='flex justify-start items-center gap-1 text-purple-700 border-b-2 border-purple-300 p-3 sm:p-4 font-semibold text-lg sm:text-xl'>
        {titleIcon} {title}
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
        {sections.map((section, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 ${index < sections.length - 1 ? 'border-b border-purple-100' : ''}`}
            style={{ gridColumn: `span ${section.colSpan || 1}` }}
          >
            <span className='text-purple-600 flex justify-start items-center gap-1 text-sm sm:text-base'>
              {section.icon} {section.label}
            </span>
            <span className='block text-gray-700 dark:text-gray-200 mt-1 text-sm sm:text-base'>
              {section.value}
            </span>
          </div>
        ))}
      </div>
      {/* Mostrar archivos adjuntos del paciente */}
      {patient._id && (
        <div className='mt-4 sm:mt-6'>
          <PatientAttachmentsForm patientId={patient._id} onUpload={() => { /* refrescar datos si es necesario */ }} />
        </div>
      )}
    </section>
  )
}

PatientContact.propTypes = {
  title: PropTypes.string,
  titleIcon: PropTypes.node,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.node,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      colSpan: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
}

export default PatientContact
