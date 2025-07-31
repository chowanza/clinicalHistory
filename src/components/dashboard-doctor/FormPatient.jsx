import FormSection from './formPatient/FormSection'
import { useForm } from 'react-hook-form'
import { usePatients } from '../../context/PatientsContext'
import {
  diagnosisFields,
  measurementsFields,
  familyInfoFields,
  medicalHistoryFields,
  consultationFields,
  medicalInfoFields,
  personalInfoFields,
} from './formPatient/formFieldsConfig'
import { useEffect, useState } from 'react'
import {
  FaFileExcel,
  FaCheckCircle,
  FaUpload,
  FaTrash,
  FaEye,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const FormPatient = ({
  closeModal,
  patientData = {},
  consultationData = null,
  isEditMode = false,
  isConsultationMode = false,
  isNewConsultation = false,
  onSubmit = null,
  editMode = null,
}) => {
  console.log('=== FORM PATIENT MOUNTED ===')
  console.log('patientData prop:', patientData)
  console.log('consultationData prop:', consultationData)
  console.log('isConsultationMode prop:', isConsultationMode)
  console.log('isNewConsultation prop:', isNewConsultation)

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: isConsultationMode ? consultationData : patientData,
  })
  const { createPatient, getPatients, updatePatients } = usePatients()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const [attachments, setAttachments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Setear todos los valores del formulario cuando cambien los datos
  useEffect(() => {
    const setAllValues = () => {
      const dataToSet = isConsultationMode ? consultationData : patientData
      console.log('=== FORM DATA DEBUG ===')
      console.log('isConsultationMode:', isConsultationMode)
      console.log('consultationData:', consultationData)
      console.log('dataToSet:', dataToSet)
      console.log('Object.keys(dataToSet):', Object.keys(dataToSet || {}))

      if (!dataToSet || Object.keys(dataToSet).length === 0) {
        console.log('⚠️ dataToSet está vacío o es null')
        return
      }

      Object.entries(dataToSet).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          console.log(`Setting field: ${key} = ${value}`)
          // Manejar fechas especiales
          if (key === 'consultationDate' && value) {
            // Convertir la fecha a formato datetime-local
            const date = new Date(value)
            const localDateTime = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
            console.log(`Converting date: ${value} -> ${localDateTime}`)
            setValue(key, localDateTime)
          } else {
            setValue(key, value)
          }
        } else {
          console.log(`⚠️ Skipping field: ${key} = ${value}`)
        }
      })

      // Cargar anexos existentes solo si estamos editando una consulta existente
      if (
        isConsultationMode &&
        consultationData &&
        consultationData._id &&
        dataToSet.attachments
      ) {
        // Limpiar archivos octet-stream antes de cargar
        const cleanedAttachments = cleanOctetStreamFiles(dataToSet.attachments)
        console.log(
          'Setting cleaned attachments for editing:',
          cleanedAttachments
        )
        setAttachments(cleanedAttachments)
      } else if (isConsultationMode) {
        // Limpiar attachments para nuevas consultas
        console.log('Setting empty attachments for new consultation')
        setAttachments([])
      }

      console.log('=== END FORM DATA DEBUG ===')
    }
    setAllValues()
  }, [patientData, consultationData, setValue, isConsultationMode])

  // Función para limpiar archivos octet-stream
  const cleanOctetStreamFiles = (attachments) => {
    if (!attachments || !Array.isArray(attachments)) return []

    console.log('=== CLEANING OCTET-STREAM FILES ===')
    console.log('Original attachments:', attachments)

    const cleanedAttachments = attachments.filter((attachment) => {
      // Obtener el tipo MIME del archivo
      const mimeType = attachment.type || attachment.mimeType || ''
      const hasValidData = attachment.data && attachment.data.length > 0
      const hasValidUrl = attachment.url && attachment.url.length > 0

      console.log('Checking attachment:', {
        name: attachment.name || attachment.originalName,
        mimeType,
        hasValidData,
        hasValidUrl,
        dataLength: attachment.data ? attachment.data.length : 0,
        urlLength: attachment.url ? attachment.url.length : 0,
      })

      // Excluir archivos octet-stream sin datos válidos
      if (mimeType === 'application/octet-stream') {
        if (!hasValidData && !hasValidUrl) {
          console.log(
            'Removing octet-stream file without valid data:',
            attachment.name || attachment.originalName
          )
          return false
        }
        // También excluir si los datos están vacíos o son muy pequeños
        if (attachment.data && attachment.data.length < 100) {
          console.log(
            'Removing octet-stream file with insufficient data:',
            attachment.name || attachment.originalName
          )
          return false
        }
      }

      return true
    })

    console.log('Cleaned attachments:', cleanedAttachments)
    console.log(
      'Removed',
      attachments.length - cleanedAttachments.length,
      'octet-stream files'
    )

    return cleanedAttachments
  }

  // Función para convertir archivo a base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Manejar selección de archivos
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files).filter(
      (file) => file.size > 0 && file.name && file.name.trim() !== ''
    )

    if (files.length === 0) {
      console.log('No se seleccionaron archivos válidos')
      return
    }

    setUploading(true)

    try {
      const base64Files = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file)
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64,
          }
        })
      )

      setAttachments((prev) => [...prev, ...base64Files])
    } catch (error) {
      console.error('Error converting files to base64:', error)
      setFormError('Error al procesar los archivos')
    } finally {
      setUploading(false)
    }
  }

  // Eliminar anexo
  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Obtener icono según tipo de archivo
  const getFileIcon = (mimeType, url) => {
    if (!mimeType) {
      return <FaFileAlt className='w-8 h-8 text-gray-600' />
    }

    if (mimeType.startsWith('image/')) {
      return (
        <img src={url} alt='Imagen' className='w-8 h-8 object-cover rounded' />
      )
    } else if (mimeType.includes('pdf')) {
      return <FaFilePdf className='w-8 h-8 text-red-600' />
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FaFileWord className='w-8 h-8 text-blue-600' />
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <FaFileExcel className='w-8 h-8 text-green-600' />
    } else {
      return <FaFileAlt className='w-8 h-8 text-gray-600' />
    }
  }

  const handleFormSubmit = handleSubmit(async (data) => {
    if (isSubmitting) {
      console.log('Form already submitting, ignoring duplicate submit')
      return
    }

    setIsSubmitting(true)
    setFormError('')
    console.log('=== FORM SUBMIT DEBUG ===')
    console.log('patientData:', patientData)
    console.log('consultationData:', consultationData)
    console.log('isConsultationMode:', isConsultationMode)
    console.log('isEditMode:', isEditMode)

    // Agregar un delay más largo para evitar duplicaciones rápidas
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (isConsultationMode) {
      // Validar solo los campos realmente requeridos para consulta
      const requiredConsultFields = ['consultMotive', 'physicalExam']
      for (const field of requiredConsultFields) {
        if (
          !data[field] ||
          typeof data[field] !== 'string' ||
          data[field].trim() === ''
        ) {
          setFormError(`El campo ${field} es requerido y no puede estar vacío.`)
          return
        }
      }
      // Los demás campos (medidas, diagnóstico, etc.) son opcionales
    } else {
      // Validación completa para paciente
      // Validación frontend para teléfono
      if (!/^[0-9]{6,}$/.test(data.phone)) {
        setFormError('El teléfono debe tener al menos 6 dígitos numéricos.')
        return
      }

      // Validación frontend para email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        setFormError('El email debe tener un formato válido.')
        return
      }
    }

    try {
      // Agregar anexos a los datos si estamos en modo consulta
      if (isConsultationMode) {
        // Solo agregar attachments si hay nuevos y válidos
        if (attachments.length > 0) {
          // Filtrar attachments válidos (con datos) y limpiar octet-stream
          const validAttachments = attachments.filter(
            (att) =>
              att.data &&
              att.data.length > 0 &&
              att.name &&
              att.name.trim() !== ''
          )

          // Limpiar archivos octet-stream
          const cleanedAttachments = cleanOctetStreamFiles(validAttachments)

          if (cleanedAttachments.length > 0) {
            data.attachments = cleanedAttachments
          }
        } else if (
          consultationData &&
          consultationData._id &&
          consultationData.attachments
        ) {
          // Solo mantener attachments existentes si estamos editando una consulta
          // Limpiar archivos octet-stream de los attachments existentes
          const cleanedExistingAttachments = cleanOctetStreamFiles(
            consultationData.attachments
          )
          data.attachments = cleanedExistingAttachments
        }
      }

      const dataToSend = { ...data }
      console.log('Initial dataToSend:', dataToSend)

      // Si estamos en modo consulta y es una edición (no nueva consulta), preservar el consultationNumber
      if (
        isConsultationMode &&
        consultationData &&
        consultationData._id &&
        consultationData.consultationNumber
      ) {
        dataToSend.consultationNumber = consultationData.consultationNumber
        console.log(
          'Preserving consultationNumber for edit:',
          consultationData.consultationNumber
        )
      }

      // Convertir todos los valores a string, excepto attachments
      Object.keys(dataToSend).forEach((key) => {
        if (
          dataToSend[key] !== undefined &&
          dataToSend[key] !== null &&
          key !== 'attachments'
        ) {
          dataToSend[key] = String(dataToSend[key])
        }
      })

      console.log('Final dataToSend:', dataToSend)

      if (isConsultationMode) {
        // Lógica para consultas
        const isNewConsultation = !consultationData || !consultationData._id

        // Verificar que tenemos el ID del paciente
        console.log('Checking patientData:', patientData)
        console.log('patientData type:', typeof patientData)
        console.log(
          'patientData keys:',
          patientData ? Object.keys(patientData) : 'null'
        )

        if (!patientData) {
          console.error('patientData is null or undefined')
          setFormError(
            'Error: No se pudo identificar al paciente. Por favor, recarga la página.'
          )
          return
        }

        if (!patientData._id) {
          console.error('patientData._id is missing:', patientData)
          setFormError(
            'Error: ID del paciente no válido. Por favor, recarga la página.'
          )
          return
        }

        const url = isNewConsultation
          ? `http://localhost:4000/api/tasks/${patientData._id}/consultations`
          : `http://localhost:4000/api/tasks/${patientData._id}/consultations/${consultationData._id}`

        const method = isNewConsultation ? 'POST' : 'PUT'

        console.log('Consultation URL:', url)
        console.log('Consultation method:', method)

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Consultation saved successfully:', result)
          if (onSubmit) onSubmit(result)
          closeModal()
        } else {
          const errorData = await response.json()
          console.error('Error response:', errorData)
          setFormError(
            `Error al guardar la consulta: ${
              errorData.message || 'Error desconocido'
            }`
          )
        }
      } else {
        // Lógica para pacientes
        if (isEditMode) {
          console.log('=== EDIT MODE DEBUG ===')
          console.log('patientData:', patientData)
          console.log('patientData._id:', patientData?._id)
          console.log('dataToSend:', dataToSend)

          if (!patientData || !patientData._id) {
            console.error('Missing patient data or ID for editing')
            setFormError(
              'Error: No se pudo identificar al paciente para editar.'
            )
            return
          }

          console.log('Calling updatePatients with ID:', patientData._id)
          await updatePatients(patientData._id, dataToSend)
        } else {
          await createPatient(dataToSend)
        }
        await getPatients()
        closeModal()
      }
    } catch (error) {
      console.error('Error in form submission:', error)
      setFormError(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
    console.log('=== END FORM SUBMIT DEBUG ===')
  })

  const hasImportedData =
    patientData && Object.keys(patientData).length > 0 && !isConsultationMode

  const getTitle = () => {
    if (isConsultationMode) {
      if (isNewConsultation) {
        return consultationData
          ? 'Nueva Consulta (basada en datos anteriores)'
          : 'Nueva Consulta'
      }
      return consultationData ? 'Editar Consulta' : 'Nueva Consulta'
    }
    return isEditMode ? 'Editar Paciente' : 'Agregar Nuevo Paciente'
  }

  const getSubmitButtonText = () => {
    if (isConsultationMode) {
      if (isNewConsultation) {
        return 'Crear Nueva Consulta'
      }
      return consultationData ? 'Actualizar Consulta' : 'Crear Consulta'
    }
    return 'Guardar Historia Clínica'
  }

  return (
    <div className='w-full min-h-full dark:bg-background-dark dark:text-text-dark bg-background-light text-text-light flex justify-center items-center flex-col p-2 sm:p-4'>
      <h1 className='text-center text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4'>
        {getTitle()}
      </h1>

      {hasImportedData && !isConsultationMode && (
        <div className='w-full max-w-4xl bg-blue-100 text-blue-800 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 flex items-center gap-2'>
          <FaCheckCircle />
          <span className='text-xs sm:text-sm md:text-base'>
            Datos cargados desde Excel. Revise y complete la información antes
            de guardar.
          </span>
        </div>
      )}

      {isConsultationMode && isNewConsultation && consultationData && (
        <div className='w-full max-w-4xl bg-green-100 text-green-800 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 flex items-center gap-2'>
          <FaCheckCircle />
          <span className='text-xs sm:text-sm md:text-base'>
            Se han copiado los datos de la consulta anterior. Revise y actualice
            la información según sea necesario.
          </span>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className='w-full max-w-4xl flex flex-col gap-4 sm:gap-6 p-2 sm:p-4 md:p-6 rounded-lg mx-auto bg-white overflow-y-auto dark:bg-slate-800 shadow-lg'
      >
        {formError && (
          <div className='bg-red-100 text-red-700 p-2 rounded mb-2 text-center font-semibold text-sm sm:text-base'>
            {formError}
          </div>
        )}

        {/* === PERFIL DEL PACIENTE === */}
        {!isConsultationMode && (
          <div className='border-l-4 border-blue-500 pl-2 sm:pl-4 mb-4 sm:mb-6'>
            <h2 className='text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4'>
              📋 PERFIL DEL PACIENTE
            </h2>

            {/* Información Personal - mostrar siempre en modo paciente */}
            <FormSection
              sectionTitle='Información Personal'
              fields={personalInfoFields}
              register={register}
              patientData={patientData}
              setValue={setValue}
              watch={watch}
            />

            {/* Información Familiar - mostrar siempre en modo paciente */}
            <FormSection
              sectionTitle='Información Familiar'
              fields={familyInfoFields}
              register={register}
              patientData={patientData}
              setValue={setValue}
              watch={watch}
            />

            {/* Historia Médica - mostrar siempre en modo paciente */}
            <FormSection
              sectionTitle='Historia Médica'
              fields={medicalHistoryFields}
              register={register}
              patientData={patientData}
              setValue={setValue}
              watch={watch}
            />
          </div>
        )}

        {/* === CONSULTA MÉDICA === */}
        {!isEditMode && !isConsultationMode && (
          <div className='border-l-4 border-green-500 pl-2 sm:pl-4'>
            <h2 className='text-base sm:text-lg font-semibold text-green-600 dark:text-green-400 mb-3 sm:mb-4'>
              🏥 CONSULTA MÉDICA
            </h2>

            {/* Datos de la Consulta */}
            <FormSection
              sectionTitle='Datos de la Consulta'
              fields={consultationFields}
              register={register}
              patientData={isConsultationMode ? consultationData : patientData}
              setValue={setValue}
              watch={watch}
            />

            {/* Medidas Antropométricas */}
            <FormSection
              sectionTitle='Medidas Antropométricas'
              fields={measurementsFields}
              register={register}
              patientData={isConsultationMode ? consultationData : patientData}
              setValue={setValue}
              watch={watch}
            />

            {/* Diagnóstico y Tratamiento */}
            <FormSection
              sectionTitle='Diagnóstico y Tratamiento'
              fields={diagnosisFields}
              register={register}
              patientData={isConsultationMode ? consultationData : patientData}
              setValue={setValue}
              watch={watch}
            />

            {/* Información Médica Adicional */}
            <FormSection
              sectionTitle='Información Médica Adicional'
              fields={medicalInfoFields}
              register={register}
              patientData={isConsultationMode ? consultationData : patientData}
              setValue={setValue}
              watch={watch}
            />
          </div>
        )}

        {/* === CONSULTA MÉDICA (MODO CONSULTA) === */}
        {isConsultationMode && (
          <div className='border-l-4 border-green-500 pl-2 sm:pl-4'>
            <h2 className='text-base sm:text-lg font-semibold text-green-600 dark:text-green-400 mb-3 sm:mb-4'>
              🏥 CONSULTA MÉDICA
            </h2>

            {/* Datos de la Consulta */}
            <FormSection
              sectionTitle='Datos de la Consulta'
              fields={consultationFields}
              register={register}
              patientData={consultationData}
              setValue={setValue}
              watch={watch}
            />

            {/* Medidas Antropométricas */}
            <FormSection
              sectionTitle='Medidas Antropométricas'
              fields={measurementsFields}
              register={register}
              patientData={consultationData}
              setValue={setValue}
              watch={watch}
            />

            {/* Diagnóstico y Tratamiento */}
            <FormSection
              sectionTitle='Diagnóstico y Tratamiento'
              fields={diagnosisFields}
              register={register}
              patientData={consultationData}
              setValue={setValue}
              watch={watch}
            />

            {/* Información Médica Adicional */}
            <FormSection
              sectionTitle='Información Médica Adicional'
              fields={medicalInfoFields}
              register={register}
              patientData={consultationData}
              setValue={setValue}
              watch={watch}
            />

            {/* === ANEXOS === */}
            {/* Mostrar anexos para todas las consultas */}
            {isConsultationMode && (
              <div className='border-l-4 border-purple-500 pl-2 sm:pl-4'>
                <h2 className='text-base sm:text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3 sm:mb-4'>
                  📎 ANEXOS
                </h2>

                <div className='space-y-4'>
                  {/* Subir archivos */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Agregar Anexos
                    </label>
                    <div className='relative'>
                      <input
                        type='file'
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                        className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50'
                        accept='image/*,.pdf,.doc,.docx,.xls,.xlsx'
                      />
                      {uploading && (
                        <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded'>
                          <div className='flex items-center gap-2 text-purple-600'>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600'></div>
                            <span className='text-sm'>
                              Procesando archivos...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Formatos permitidos: imágenes, PDF, Word, Excel
                    </p>
                  </div>

                  {/* Lista de anexos */}
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Anexos ({attachments.length})
                    </h3>

                    {attachments.length > 0 ? (
                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg'
                          >
                            <div className='flex-shrink-0'>
                              {getFileIcon(
                                attachment.type || attachment.mimeType,
                                attachment.data || attachment.url
                              )}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                                {attachment.name || attachment.originalName}
                              </p>
                              <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {attachment.size
                                  ? (attachment.size / 1024 / 1024).toFixed(2) +
                                    ' MB'
                                  : 'Tamaño desconocido'}
                              </p>
                            </div>
                            <button
                              type='button'
                              onClick={() => removeAttachment(index)}
                              className='flex-shrink-0 p-1 text-red-600 hover:text-red-800'
                            >
                              <FaTrash className='w-4 h-4' />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-6 bg-gray-50 dark:bg-slate-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600'>
                        <FaFileAlt className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-2' />
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          No hay anexos agregados aún
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                          Selecciona archivos arriba para agregar anexos
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className='flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6 sm:mt-8'>
          <button
            type='button'
            onClick={closeModal}
            disabled={isSubmitting}
            className='p-2 sm:p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center justify-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='p-2 sm:p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-secondary/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Guardando...
              </>
            ) : (
              getSubmitButtonText()
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormPatient
