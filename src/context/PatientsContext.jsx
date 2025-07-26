import { createContext, useState, useContext } from 'react'
import {
  createPatientsRequest,
  getPatientsRequest,
  getPatientRequest,
  deletePatientsRequest,
  updatePatientsRequest,
} from '../api/patients'

const PatientsContext = createContext()

export const usePatients = () => {
  const context = useContext(PatientsContext)
  if (!context) {
    throw new Error('usePatients must be used within a PatientsProvider')
  }
  return context
}

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([])
  const [patient, setPatient] = useState({})

  const updatePatients = async (patientData) => {
    try {
      const res = await updatePatientsRequest(patientData.id, patientData.data)
      setPatient(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const deletePatient = async (id) => {
    try {
      await deletePatientsRequest(id)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const getPatients = async () => {
    try {
      const res = await getPatientsRequest()
      setPatients(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const createPatient = async (patientData) => {
    try {
      console.log('=== CREATING PATIENT ===');
      console.log('Patient data to send:', patientData);
      console.log('Patient data type:', typeof patientData);
      console.log('Patient data keys:', Object.keys(patientData));
      
      const res = await createPatientsRequest(patientData)
      console.log('Response:', res)
      return res.data // Retornar el paciente creado
    } catch (error) {
      console.error('Error creating patient:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      
      // Manejar errores específicos
      if (error.message.includes('Unexpected token')) {
        throw new Error('El servidor no está respondiendo correctamente. Verifique que el backend esté ejecutándose en http://localhost:4000')
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Error de validación en los datos'
        throw new Error(errorMessage)
      } else {
        throw error // Propaga el error para que el formulario lo muestre
      }
    }
  }

  const getPatient = async (id) => {
    try {
      console.log('=== GET PATIENT DEBUG ===')
      console.log('Fetching patient with ID:', id)
      const res = await getPatientRequest(id)
      console.log('Patient response:', res)
      console.log('Patient data:', res.data)
      setPatient(res.data)
      console.log('Patient state updated')
    } catch (error) {
      console.error('Error fetching patient:', error)
      console.error('Error response:', error.response)
      console.error('Error message:', error.message)
    }
  }

  return (
    <PatientsContext.Provider
      value={{
        patients,
        patient,
        createPatient,
        getPatients,
        getPatient,
        deletePatient,
        updatePatients,
        setPatients,
      }}
    >
      {children}
    </PatientsContext.Provider>
  )
}
