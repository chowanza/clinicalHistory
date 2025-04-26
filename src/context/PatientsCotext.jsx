import { createContext, useState, useContext } from 'react'
import { createPatientsRequest } from '../api/patients'

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

  const createPatient = async (patientData) => {
    const res = await createPatientsRequest(patientData)
    console.log(res)
  }

  return (
    <PatientsContext.Provider value={{ patients, createPatient }}>
      {children}
    </PatientsContext.Provider>
  )
}
