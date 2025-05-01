import FormSection from './formPatient/FormSection'
import { useForm } from 'react-hook-form'
import { usePatients } from '../../context/PatientsContext'
import {
  diagnosisFields,
  measurementsFields,
  familyInfoFields,
  medicalHistoryFields,
  medicalInfoFields,
  personalInfoFields,
} from './formPatient/formFieldsConfig'
import { useEffect } from 'react'
import { FaFileExcel, FaCheckCircle } from 'react-icons/fa'

const FormPatient = ({ closeModal, patientData = {}, isEditMode = false }) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: patientData,
  })
  const { createPatient, getPatients, updatePatients } = usePatients()

  // Setear todos los valores del formulario cuando cambien los datos
  useEffect(() => {
    const setAllValues = () => {
      Object.entries(patientData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key, value)
        }
      })
    }
    setAllValues()
  }, [patientData, setValue])

  const onSubmit = handleSubmit((data) => {
    // Limpieza de datos antes de enviar
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    )

    if (isEditMode) {
      updatePatients({ id: patientData._id, data: cleanedData })
    } else {
      createPatient(cleanedData)
    }
    getPatients()
    closeModal()
  })

  // Verificar si hay datos importados
  const hasImportedData = !isEditMode && Object.keys(patientData).length > 0

  return (
    <div className='w-full min-h-full dark:bg-background-dark dark:text-text-dark bg-background-light text-text-light flex justify-center items-center flex-col'>
      <h1 className='text-center text-3xl font-bold mb-4'>
        {isEditMode ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}
      </h1>

      {hasImportedData && (
        <div className='w-2/3 bg-blue-100 text-blue-800 p-3 rounded-lg mb-4 flex items-center gap-2'>
          <FaCheckCircle />
          Datos cargados desde Excel. Revise y complete la información antes de
          guardar.
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className='w-2/3 flex flex-col gap-6 p-6 rounded-lg mx-auto bg-white max-h-max dark:bg-slate-800 shadow-lg'
      >
        {/* Información Personal */}
        <FormSection
          sectionTitle='Información Personal'
          fields={personalInfoFields}
          register={register}
          patientData={patientData}
        />

        {/* Información Familiar */}
        <FormSection
          sectionTitle='Información Familiar'
          fields={familyInfoFields}
          register={register}
          patientData={patientData}
        />

        {/* Historia Médica */}
        <FormSection
          sectionTitle='Historia Médica'
          fields={medicalHistoryFields}
          register={register}
          patientData={patientData}
        />

        {/* Medidas Antropométricas */}
        <FormSection
          sectionTitle='Medidas Antropométricas'
          fields={measurementsFields}
          register={register}
          patientData={patientData}
        />

        {/* Diagnóstico y Tratamiento */}
        <FormSection
          sectionTitle='Diagnóstico y Tratamiento'
          fields={diagnosisFields}
          register={register}
          patientData={patientData}
        />

        {/* Información Médica Adicional */}
        <FormSection
          sectionTitle='Información Médica Adicional'
          fields={medicalInfoFields}
          register={register}
          patientData={patientData}
        />

        <div className='flex justify-end gap-4 mt-8'>
          <button
            type='button'
            onClick={closeModal}
            className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-secondary/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse'
          >
            Guardar Historia Clínica
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormPatient
