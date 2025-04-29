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
      const res = await updatePatientsRequest(patientData)
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
    const res = await createPatientsRequest(patientData)
    console.log(res)
  }

  const getPatient = async (id) => {
    try {
      const res = await getPatientRequest(id)
      setPatient(res.data)
    } catch (error) {
      console.error(error)
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
