import { Link } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch'
import { useAuth } from '../../context/AuthContext'
import Tooltip from '@mui/material/Tooltip'

import {
  FaArrowRightFromBracket,
  FaArrowUpRightFromSquare,
  FaFileMedical,
  FaStethoscope,
  FaUserDoctor,
} from 'react-icons/fa6'

const Header = ({ patientPage, openModal }) => {
  const { logout } = useAuth()

  return (
    <header className='top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 border-b border-slate-200/50 dark:border-slate-700/50 shadow-xl'>
      <div className='flex flex-col lg:flex-row justify-between items-center p-4 sm:p-6 gap-4 lg:gap-6 w-full max-w-7xl mx-auto'>
        {/* Logo y título mejorado */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg ring-4 ring-white/20 dark:ring-slate-700/50'>
            <FaStethoscope className='text-white text-xl' />
          </div>
          <div>
            <h1 className='font-bold text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight'>
              Consultorio Dra. Eunice Brito
            </h1>
            <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium'>
              Sistema de Gestión Médica
            </p>
          </div>
        </div>

        {/* Navegación mejorada */}
        <div className='flex items-center gap-3 flex-wrap justify-center lg:justify-end'>
          {patientPage ? (
            <>
              <Tooltip title='Gestión de Recetas Médicas' arrow>
                <button
                  onClick={openModal.openMedicalCalendar}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400/30'
                >
                  <FaFileMedical className='transition-transform duration-300 group-hover:rotate-12' />
                  <span className='hidden sm:inline'>Recetas</span>
                </button>
              </Tooltip>

              <Tooltip title='Calendario de Vacunación' arrow>
                <button
                  onClick={openModal.openVaccinationSchedule}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-violet-500/20 hover:border-violet-400/30'
                >
                  <FaArrowUpRightFromSquare className='transition-transform duration-300 group-hover:scale-110' />
                  <span className='hidden sm:inline'>Vacunas</span>
                </button>
              </Tooltip>

              <Tooltip title='Editar Información del Paciente' arrow>
                <button
                  onClick={openModal.openFormModal}
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/20 hover:border-blue-400/30'
                >
                  <FaUserDoctor className='transition-transform duration-300 group-hover:rotate-12' />
                  <span className='hidden sm:inline'>Editar</span>
                </button>
              </Tooltip>

              <Tooltip title='Volver al Dashboard Principal' arrow>
                <Link
                  to='/dashboard-doctor'
                  className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-amber-500/20 hover:border-amber-400/30'
                >
                  <FaArrowRightFromBracket className='rotate-180 transition-transform duration-300 group-hover:-translate-x-1' />
                  <span className='hidden sm:inline'>Dashboard</span>
                </Link>
              </Tooltip>
            </>
          ) : (
            <></>
          )}

          {/* Separador visual */}
          {patientPage && (
            <div className='w-px h-8 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent'></div>
          )}

          <Tooltip title='Cerrar Sesión' arrow>
            <Link
              to='/signin'
              onClick={() => logout()}
              className='group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-red-500/20 hover:border-red-400/30'
            >
              <FaArrowRightFromBracket className='transition-transform duration-300 group-hover:translate-x-1' />
              <span className='hidden sm:inline'>Salir</span>
            </Link>
          </Tooltip>

          <div className='flex items-center justify-center'>
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* Barra decorativa inferior */}
      <div className='h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30'></div>
    </header>
  )
}

export default Header
