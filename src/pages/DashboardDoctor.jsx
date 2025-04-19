import { FaPlus } from 'react-icons/fa'
import { FaFileExport, FaArrowRightFromBracket } from 'react-icons/fa6'
import EnhancedTable from '../components/dashboard-doctor/EnhancedTable'
import ThemeSwitch from '../components/ui/ThemeSwitch'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardDoctor = () => {
  const { user } = useAuth()
  console.log(user)

  return (
    <main className='relative min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark px-24 py-5 gap-5 flex flex-col justify-around'>
      <header className='flex justify-end p-0 w-full'>
        <Link className='flex justify-center items-center gap-3 font-semibold text-secondary'>
          Log Out <FaArrowRightFromBracket />
        </Link>
      </header>
      <div className='absolute top-0 right-0 p-4'>
        <ThemeSwitch />
      </div>
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
      <div>
        <EnhancedTable />
      </div>
    </main>
  )
}

export default DashboardDoctor
