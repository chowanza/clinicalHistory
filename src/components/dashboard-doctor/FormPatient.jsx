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
import { FaFileExcel, FaCheckCircle, FaUpload, FaTrash, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const FormPatient = ({ 
  closeModal, 
  patientData = {}, 
  consultationData = null,
  isEditMode = false, 
  isConsultationMode = false,
  isNewConsultation = false,
  onSubmit = null,
  editMode = null
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: isConsultationMode ? consultationData : patientData,
  })
  const { createPatient, getPatients, updatePatients } = usePatients()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')

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
            const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
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
      
      console.log('=== END FORM DATA DEBUG ===')
    }
    setAllValues()
  }, [patientData, consultationData, setValue, isConsultationMode])

  // Eliminar: const handleFileUpload = (event) => {
  // Eliminar:   const files = Array.from(event.target.files)
  // Eliminar:   setAttachments(prev => [...prev, ...files])
  // Eliminar: }

  // Eliminar: const removeAttachment = (index) => {
  // Eliminar:   setAttachments(prev => prev.filter((_, i) => i !== index))
  // Eliminar: }

  const handleFormSubmit = handleSubmit(async (data) => {
    setFormError('')
    if (isConsultationMode) {
      // Validar solo los campos realmente requeridos para consulta
      const requiredConsultFields = [
        'consultMotive','physicalExam'
      ];
      for (const field of requiredConsultFields) {
        if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
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
      if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        setFormError('El email no es válido.')
        return
      }
      // Validación frontend para fecha de nacimiento (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
        setFormError('La fecha de nacimiento debe tener formato YYYY-MM-DD.')
        return
      }
      // (Quitar validación de mayor que cero en modo paciente)
      // Validación frontend para campos de texto requeridos no vacíos
      const requiredTextFields = isEditMode ? [
        // Solo campos de información personal y familiar para edición
        'firstNames','lastNames','phone','email','address','dadName','momName','obstetrician','neonatal','personal','familiar'
      ] : [
        // Solo campos del paciente para nuevo paciente (la consulta es opcional)
        'firstNames','lastNames','phone','email','address','dadName','momName','obstetrician','neonatal','personal','familiar'
      ];
      for (const field of requiredTextFields) {
        if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
          setFormError(`El campo ${field} es requerido y no puede estar vacío.`)
          return
        }
      }
    }
    console.log('=== FORM SUBMIT DEBUG ===')
    console.log('Form data received:', data)
    console.log('Form submission started')

    // Siempre enviar JSON puro para datos normales (paciente o consulta)
    const dataToSend = { ...data };
    console.log('Initial dataToSend:', dataToSend);
    
    // Si estamos en modo consulta y es una edición (no nueva consulta), preservar el consultationNumber
    if (isConsultationMode && consultationData && consultationData._id && consultationData.consultationNumber) {
      dataToSend.consultationNumber = consultationData.consultationNumber;
      console.log('Preserving consultationNumber for edit:', consultationData.consultationNumber);
    }
    
    // Convertir todos los valores a string
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] !== undefined && dataToSend[key] !== null) {
        dataToSend[key] = String(dataToSend[key]);
      }
    });
    
    console.log('Final dataToSend after string conversion:', dataToSend);
    console.log('Required fields check:');
    const requiredFields = ['firstNames','lastNames','dadName','momName','obstetrician','address','phone','email','neonatal','personal','familiar'];
    requiredFields.forEach(field => {
      console.log(`${field}:`, dataToSend[field], 'exists:', !!dataToSend[field]);
    });
    if (isConsultationMode) {
      if (onSubmit) {
        try {
          console.log('Calling onSubmit with dataToSend:', dataToSend)
          await onSubmit(dataToSend)
          console.log('onSubmit completed successfully')
        } catch (error) {
          setFormError(error?.response?.data?.message || 'Error al guardar la consulta')
          console.error('Error in onSubmit:', error)
        }
      } else {
        setFormError('onSubmit is not defined')
      }
    } else {
      // Lógica para paciente
      if (isEditMode) {
        try {
          await updatePatients(dataToSend)
          console.log('Patient updated successfully')
          closeModal()
          getPatients()
        } catch (error) {
          setFormError(error?.response?.data?.message || 'Error al actualizar el paciente')
          console.error('Error updating patient:', error)
        }
      } else {
        try {
          await createPatient(dataToSend)
          console.log('Patient created successfully')
          closeModal()
          getPatients()
        } catch (error) {
          setFormError(error?.response?.data?.message || 'Error al crear el paciente')
          console.error('Error creating patient:', error)
        }
      }
    }
    console.log('=== END FORM SUBMIT DEBUG ===')
  })

  // Verificar si hay datos importados
  const hasImportedData = !isEditMode && patientData && Object.keys(patientData).length > 0

  const getTitle = () => {
    if (isConsultationMode) {
      if (isNewConsultation) {
        return consultationData ? 'Nueva Consulta (basada en datos anteriores)' : 'Nueva Consulta'
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
          <span className="text-xs sm:text-sm md:text-base">
            Datos cargados desde Excel. Revise y complete la información antes de
            guardar.
          </span>
        </div>
      )}

      {isConsultationMode && isNewConsultation && consultationData && (
        <div className='w-full max-w-4xl bg-green-100 text-green-800 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 flex items-center gap-2'>
          <FaCheckCircle />
          <span className="text-xs sm:text-sm md:text-base">
            Se han copiado los datos de la consulta anterior. Revise y actualice la información según sea necesario.
          </span>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className='w-full max-w-4xl flex flex-col gap-4 sm:gap-6 p-2 sm:p-4 md:p-6 rounded-lg mx-auto bg-white max-h-[90vh] overflow-y-auto dark:bg-slate-800 shadow-lg'
      >
        {formError && (
          <div className='bg-red-100 text-red-700 p-2 rounded mb-2 text-center font-semibold text-sm sm:text-base'>
            {formError}
          </div>
        )}
        {/* === PERFIL DEL PACIENTE === */}
        {!isConsultationMode && (
          <div className="border-l-4 border-blue-500 pl-2 sm:pl-4 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
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
          <div className="border-l-4 border-green-500 pl-2 sm:pl-4">
            <h2 className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400 mb-3 sm:mb-4">
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
          <div className="border-l-4 border-green-500 pl-2 sm:pl-4">
            <h2 className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400 mb-3 sm:mb-4">
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
          </div>
        )}

        <div className='flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6 sm:mt-8'>
          <button
            type='button'
            onClick={closeModal}
            className='p-2 sm:p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center justify-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse text-sm sm:text-base'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='p-2 sm:p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-secondary/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse text-sm sm:text-base'
          >
            {getSubmitButtonText()}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormPatient
