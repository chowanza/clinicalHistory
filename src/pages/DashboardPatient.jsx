import React from 'react'
import PatientCard from '../components/dashboard-patient/PatientCard'
import PatientInfo from '../components/dashboard-patient/PatientInfo'
import PatientContact from '../components/dashboard-patient/PatientContact'

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
    status: 'Active',
    socialSecurityNumber: '987654321',
    contact: {
      phone: '+39 02 1234 5678',
      email: 'mario.balotelli@email.com',
      emergencyContact: {
        name: 'Luigi Balotelli',
        relationship: 'Brother',
        phone: '+39 02 8765 4321',
      },
    },
    medicalHistory: {
      family: {
        diabetes: false,
        hypertension: true,
        cancer: false,
        heartDisease: false,
        other: ['Asthma (father)'],
      },
      personal: {
        conditions: [
          {
            name: 'Knee Ligament Injury',
            diagnosisDate: '2018',
            notes: 'Recovered after surgery and physiotherapy.',
          },
        ],
        surgeries: [
          {
            name: 'ACL Reconstruction',
            date: '2018-06-15',
            notes: 'Post-surgery rehabilitation was successful.',
          },
        ],
      },
    },
    allergies: [
      {
        type: 'Food',
        allergen: 'Peanuts',
        severity: 'Moderate',
        reaction: 'Skin rash, itching',
        detectionDate: '2005',
      },
    ],
    createdAt: new Date('2023-01-15T10:30:00Z'),
    updatedAt: new Date('2024-03-12T14:20:00Z'),
  }

  return (
    <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen'>
      <article className='w-full p-4 px-60 flex flex-col gap-6'>
        <PatientCard patient={patientExample} />
        <PatientInfo patient={patientExample} />
        <PatientContact contact={patientExample.contact} />
      </article>
    </main>
  )
}

export default DashboardPatient
