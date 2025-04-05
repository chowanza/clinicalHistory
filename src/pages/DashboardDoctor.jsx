import { FaPlus } from 'react-icons/fa'
import { FaFileExport } from 'react-icons/fa6'
import EnhancedTable from '../components/dashboard-doctor/EnhancedTable'

const DashboardDoctor = () => {
  return (
    <div className='relative min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark px-24 py-10 gap-5 flex flex-col justify-around'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-2xl text-text-light dark:text-text-dark'>
          Medical Record Dashboard
        </h1>
        <div className='flex gap-4'>
          <button className='p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center gap-2'>
            <FaPlus />
            Add New Record
          </button>
          <button className='p-3 text-white font-semibold rounded-xl bg-[#10793F] flex items-center gap-2'>
            <FaFileExport />
            Import From Excel
          </button>
        </div>
      </div>
      <div>
        <EnhancedTable />
      </div>
    </div>
  )
}

export default DashboardDoctor
