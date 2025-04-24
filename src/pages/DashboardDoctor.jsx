import { useState, useCallback } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FaFileExport, FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EnhancedTable from '../components/dashboard-doctor/EnhancedTable'
import ThemeSwitch from '../components/ui/ThemeSwitch'
import Modal from '../components/ui/Modal'
import FormPatient from '../components/dashboard-doctor/FormPatient'
import PatientSearchBar from '../components/dashboard-doctor/PatientSearchBar'

const DashboardDoctor = () => {
  const { user } = useAuth()

  const [filter, setFilter] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <>
      <header className='flex justify-end p-5 gap-5 w-full bg-background-light dark:bg-background-dark'>
        <Link className='flex justify-center items-center gap-3 font-semibold text-secondary'>
          Log Out <FaArrowRightFromBracket />
        </Link>
        <ThemeSwitch />
      </header>
      <main className='relative min-h-[calc(100vh-73.99px)] bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark px-24 py-5 gap-10 flex flex-col justify-start'>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <button
            onClick={closeModal}
            className='p-3 text-white font-semibold rounded-xl bg-[#791010] flex items-center gap-2 border-slate-400 border cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-[#791010]/50 hover:outline-2 hover:outline-white hover:bg-opacity-80 hover:animate-pulse absolute top-8 right-5'
          >
            Close
          </button>
          <FormPatient closeModal={closeModal} />
        </Modal>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-2xl text-text-light dark:text-text-dark'>
            Medical Record Dashboard
          </h1>
          <div className='flex gap-4'>
            <button
              className='p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center gap-2 border-slate-400 border cursor-pointer
              hover:scale-105 transition-transform duration-300 
              hover:shadow-lg hover:shadow-secondary/50 
              hover:outline-2 hover:outline-white 
              hover:bg-opacity-80 hover:animate-pulse'
              onClick={openModal}
            >
              <FaPlus />
              Add New Record
            </button>
            <button
              className='p-3 text-white font-semibold rounded-xl bg-[#10793F] flex items-center gap-2 border-slate-400 border cursor-pointer
              hover:scale-105 transition-transform duration-300 
              hover:shadow-lg hover:shadow-[#10793F]/50 
              hover:outline-2 hover:outline-white 
              hover:bg-opacity-80 hover:animate-pulse'
            >
              <FaFileExport />
              Import From Excel
            </button>
          </div>
        </div>
        <div className='flex flex-col justify-center w-full h-full grow'>
          <PatientSearchBar filter={filter} setFilter={setFilter} />
          <EnhancedTable filter={filter} />
        </div>
      </main>
    </>
  )
}

export default DashboardDoctor
