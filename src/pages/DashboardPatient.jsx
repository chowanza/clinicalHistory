import React from 'react'
import PatientCard from '../components/dashboard-patient/PatientCard'
import PatientInfo from '../components/dashboard-patient/PatientInfo'

const DashboardPatient = () => {
  const patientExample = {
    firstName: 'Mario',
    lastName: 'Balotelli',
    recordNumber: 'PAC-2023-0458', // Unique patient record identifier
    age: 33,
    gender: 'Male',
    bloodType: 'O+',
    birthDate: '1990-08-12',
    maritalStatus: 'Single',
    occupation: 'Football Player',
    nationality: 'Italian',
    address: 'Milan, Italy',
    dni: '12345678',
  }

  return (
    <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen'>
      <article className='w-full p-4 px-60 flex flex-col gap-6'>
        <PatientCard patient={patientExample} />
        <PatientInfo patient={patientExample} />
      </article>
    </main>
  )
}

export default DashboardPatient
