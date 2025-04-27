import { createContext, useState, useContext } from 'react'
import {
  createPatientsRequest,
  getPatientsRequest,
  deletePatientsRequest,
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

  return (
    <PatientsContext.Provider
      value={{ patients, createPatient, getPatients, deletePatient }}
    >
      {children}
    </PatientsContext.Provider>
  )
}
