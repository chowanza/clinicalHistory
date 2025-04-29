import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch'
import { useAuth } from '../../context/AuthContext'
import Tooltip from '@mui/material/Tooltip'

const Header = ({ patientPage, toggleModal }) => {
  const { logout } = useAuth()

  return (
    <header className='flex justify-between p-5 gap-5 w-full bg-background-light dark:bg-background-dark'>
      <h1 className='font-bold text-2xl text-text-light dark:text-text-dark'>
        Medical Record Dashboard
      </h1>
      <div className='flex items-center gap-5'>
        {patientPage ? (
          <>
            <Tooltip title='Editar datos del paciente'>
              <button
                onClick={toggleModal}
                className='h-10 p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center border-slate-400 border cursor-pointer
                hover:scale-105 transition-transform duration-300 
                hover:shadow-lg hover:shadow-secondary/50 
                hover:outline-2 hover:outline-white 
                hover:bg-opacity-80 hover:animate-pulse'
              >
                Editar Datos
              </button>
            </Tooltip>
            <Link
              to='/dashboard-doctor'
              className='h-10 p-3 font-semibold rounded-xl flex items-center gap-2 text-[#FA0F00] border-2 border-[#FA0F00] cursor-pointer
                                hover:scale-105 transition-transform duration-300 
                                hover:shadow-lg hover:shadow-[#FA0F00]/50 
                                hover:outline-2 hover:outline-white 
                                hover:bg-opacity-80 hover:animate-pulse'
            >
              <FaArrowRightFromBracket className='rotate-180' />
              Volver al dashboard
            </Link>
          </>
        ) : (
          <></>
        )}
        <Link
          to='/signin'
          onClick={() => logout()}
          className='h-10 p-3 font-semibold rounded-xl flex items-center gap-2 text-secondary border-2 border-secondary cursor-pointer
                          hover:scale-105 transition-transform duration-300 
                          hover:shadow-lg hover:shadow-secondary/50 
                          hover:outline-2 hover:outline-white 
                          hover:bg-opacity-80 hover:animate-pulse'
        >
          Log Out <FaArrowRightFromBracket />
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  )
}

export default Header
