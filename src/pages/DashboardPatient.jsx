import PatientCard from '../components/dashboard-patient/PatientCard'
import PatientInfo from '../components/dashboard-patient/PatientInfo'
import PatientContact from '../components/dashboard-patient/PatientContact'
import ThemeSwitch from '../components/ui/ThemeSwitch'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const DashboardPatient = () => {
  const { user } = useAuth()
  const patientExample = {
    firstName: user.firstName,
    lastName: user.lastName,
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
      email: user.email,
      emergencyContact: {
        name: 'test name',
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
    <main className='w-full grid place-items-center bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark min-h-screen py-10'>
      <header className='flex justify-end p-0 w-full absolute top-6 right-30 bg-background-transparent dark:bg-background-transparent'>
        <Link className='flex justify-center items-center gap-3 font-semibold text-secondary'>
          Log Out <FaArrowRightFromBracket />
        </Link>
      </header>
      <div className='absolute top-0 right-0 p-4'>
        <ThemeSwitch />
      </div>
      <article className='w-full p-4 px-60 flex flex-col gap-6'>
        <PatientCard patient={patientExample} />
        <PatientInfo patient={patientExample} />
        <PatientContact contact={patientExample.contact} />
        <button
          className='self-end h-10 p-3 text-white font-semibold rounded-xl bg-[#FA0F00] flex items-center gap-2 border-slate-400 border cursor-pointer
                   hover:scale-105 transition-transform duration-300 
                   hover:shadow-lg hover:shadow-[#FA0F00]/50 
                   hover:outline-2 hover:outline-white 
                   hover:bg-opacity-80 hover:animate-pulse'
        >
          Download PDF
        </button>
      </article>
    </main>
  )
}

export default DashboardPatient
