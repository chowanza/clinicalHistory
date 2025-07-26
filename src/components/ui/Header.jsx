import {
  FaArrowRightFromBracket,
  FaArrowUpRightFromSquare,
  FaFileMedical,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch'
import { useAuth } from '../../context/AuthContext'
import Tooltip from '@mui/material/Tooltip'

const Header = ({ patientPage, openModal }) => {
  const { logout } = useAuth()

  return (
    <header className='flex flex-col sm:flex-row justify-between p-3 sm:p-5 gap-3 sm:gap-5 w-full bg-background-light dark:bg-background-dark min-h-20'>
      <h1 className='font-bold text-lg sm:text-xl md:text-2xl text-text-light dark:text-text-dark text-center sm:text-left'>
        Consultorio Dra. Eunice Brito
      </h1>
      <div className='flex items-center justify-center sm:justify-end gap-2 sm:gap-5 flex-wrap'>
        {patientPage ? (
          <>
            <button
              onClick={openModal.openMedicalCalendar}
              className='h-8 sm:h-10 p-2 sm:p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center border-slate-400 border cursor-pointer
                hover:scale-105 transition-transform duration-300 
                hover:shadow-lg hover:shadow-secondary/50 
                hover:outline-2 hover:outline-white 
                hover:bg-opacity-80 hover:animate-pulse gap-1 sm:gap-2 text-xs sm:text-sm'
            >
              <FaFileMedical />
              <span className='hidden sm:inline'>Récipes Médicos</span>
            </button>
            <button
              onClick={openModal.openVaccinationSchedule}
              className='h-8 sm:h-10 p-2 sm:p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center border-slate-400 border cursor-pointer
                hover:scale-105 transition-transform duration-300 
                hover:shadow-lg hover:shadow-secondary/50 
                hover:outline-2 hover:outline-white 
                hover:bg-opacity-80 hover:animate-pulse gap-1 sm:gap-2 text-xs sm:text-sm'
            >
              <FaArrowUpRightFromSquare />
              <span className='hidden sm:inline'>Tarjeta de Vacunación</span>
            </button>
            <Tooltip title='Editar datos del paciente'>
              <button
                onClick={openModal.openFormModal}
                className='h-8 sm:h-10 p-2 sm:p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center border-slate-400 border cursor-pointer
                hover:scale-105 transition-transform duration-300 
                hover:shadow-lg hover:shadow-secondary/50 
                hover:outline-2 hover:outline-white 
                hover:bg-opacity-80 hover:animate-pulse text-xs sm:text-sm'
              >
                <span className='hidden sm:inline'>Editar Datos</span>
              </button>
            </Tooltip>
            <Link
              to='/dashboard-doctor'
              className='h-8 sm:h-10 p-2 sm:p-3 font-semibold rounded-xl flex items-center gap-1 sm:gap-2 text-[#FA0F00] border-2 border-[#FA0F00] cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-[#FA0F00]/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse text-xs sm:text-sm'
            >
              <FaArrowRightFromBracket className='rotate-180' />
              <span className='hidden sm:inline'>Volver al dashboard</span>
            </Link>
          </>
        ) : (
          <></>
        )}
        <Link
          to='/signin'
          onClick={() => logout()}
          className='h-8 sm:h-10 p-2 sm:p-3 font-semibold rounded-xl flex items-center gap-1 sm:gap-2 text-secondary border-2 border-secondary cursor-pointer
                          hover:scale-105 transition-transform duration-300 
                          hover:shadow-lg hover:shadow-secondary/50 
                          hover:outline-2 hover:outline-white 
                          hover:bg-opacity-80 hover:animate-pulse text-xs sm:text-sm'
        >
          <FaArrowRightFromBracket />
          <span className='hidden sm:inline'>Salir</span>
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  )
}

export default Header
