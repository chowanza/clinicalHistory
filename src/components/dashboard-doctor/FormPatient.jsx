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

const FormPatient = ({ closeModal, patientData, isEditMode = false }) => {
  const { register, handleSubmit } = useForm()
  const { createPatient, getPatients } = usePatients()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    createPatient(data)
    getPatients()
    closeModal()
  })

  useEffect(() => {
    console.log(patientData)
  }, [])

  return (
    <div className='w-full min-h-full dark:bg-background-dark dark:text-text-dark bg-background-light text-text-light flex justify-center items-center flex-col'>
      <h1 className='text-center text-3xl font-bold'>
        {isEditMode ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}
      </h1>
      <form
        onSubmit={onSubmit}
        className='w-2/3 flex flex-col gap-4 p-4 px-8 rounded-lg mt-8 mx-auto m-0 overflow-hidden relative bg-white max-h-max dark:bg-slate-800 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_20px_rgb(20,10,100,0.5)]'
      >
        <FormSection
          sectionTitle='Información Personal'
          fields={personalInfoFields}
          register={register}
          patientData={isEditMode ? patientData : {}}
        />

        <FormSection
          sectionTitle='Información Familiar'
          fields={familyInfoFields}
          register={register}
          patientData={isEditMode ? patientData : {}}
        />

        <FormSection
          sectionTitle='Historia Médica'
          fields={medicalHistoryFields}
          register={register}
          patientData={isEditMode ? patientData : {}}
        />

        <FormSection
          sectionTitle='Medidas Antropométricas'
          fields={measurementsFields}
          register={register}
          patientData={isEditMode ? patientData : {}}
        />

        <FormSection
          sectionTitle='Diagnóstico y Tratamiento'
          fields={diagnosisFields}
          register={register}
          patientData={isEditMode ? patientData : {}}
        />

        <FormSection
          sectionTitle='Información Médica Adicional'
          fields={medicalInfoFields}
          register={register}
          patientData={isEditMode ? patientData : {}}
        />

        <div className='flex justify-end gap-4 mt-8'>
          <button
            type='button'
            onClick={closeModal}
            className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center gap-2 border-slate-400 border cursor-pointer
             hover:scale-105 transition-transform duration-300 
             hover:shadow-lg hover:shadow-secondary/50 
             hover:outline-2 hover:outline-white 
             hover:bg-opacity-80 hover:animate-pulse'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormPatient
